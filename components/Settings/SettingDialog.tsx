import { FC, useContext, useEffect, useRef, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { featureOptionFlags, getSettings, saveSettings } from '@/utils/app/settings';

import { Settings, Theme } from '@/types/settings';

import HomeContext from '@/pages/api/home/home.context';
import React from 'react';
import { StorageDialog } from './StorageDialog';
import FlagsMap, { Flag } from '../ReusableComponents/FlagsMap';
import { Modal } from '../ReusableComponents/Modal';
import { saveUserSettings } from '@/services/settingsService';
import { Model } from '@/types/model';
import toast from 'react-hot-toast';
import { ActiveTabs } from '../ReusableComponents/ActiveTabs';
import LegacyWorkspaces from '../Workspace/LegacyWorkspace';

  interface Props {
  open: boolean;
  onClose: () => void;
}

export const modelOptionFlags = [
  {
    "label": "OpenAI",
    "key": "allOpenAI",
    "defaultValue": false,
    "identifers": ['gpt', 'o1', 'o3']
  },
  {
      "label": "Claude",
      "key": "allClaude",
      "defaultValue": false,
      "identifers": ['anthropic']
  },
  {
      "label": "Mistral",
      "key": "allMistral",
      "defaultValue": false,
      "identifers": ['mistral']
  },
  {
    "label": "Llama",
    "key": "allLlama",
    "defaultValue": false,
    "identifers": ['llama']
},
  ];



type ModelKey = (typeof modelOptionFlags)[number]["key"];


export const SettingDialog: FC<Props> = ({ open, onClose }) => {
  const { t } = useTranslation('settings');
  const { dispatch: homeDispatch, state:{statsService, featureFlags, availableModels: allAvailableModels, defaultModelId, workspaces} } = useContext(HomeContext);
  let initSettingsRef = useRef<Settings | null>(null);
  // prevent recalling the getSettings function
  if (initSettingsRef.current === null) initSettingsRef.current = getSettings(featureFlags);

  const [hiddenModelIds, setHiddenModelIds] = useState<string[]>(initSettingsRef.current?.hiddenModelIds.filter((id:string) => id !== defaultModelId));


  const getAvailableModels = () => {
    const models: Model[] = Object.values(allAvailableModels);

    type ModelsMap = {
      [K in ModelKey]: { id: string; name: string }[];
    };

    const sortedModels = modelOptionFlags.reduce((acc, flag) => {
      acc[flag.key] = [];
      return acc;
    }, {} as ModelsMap);

    models.forEach((model) => {
      const matchedOption = modelOptionFlags.find(flag => {
            // Check if any pattern matches the model.id
            const identifers = flag.identifers;

            return !!identifers.find((identifier: string) => model.id.includes(identifier));
        }
      );

      if (matchedOption) sortedModels[matchedOption.key].push({ id: model.id, name: model.name });
    });


      Object.entries(sortedModels).forEach(([key, models]) => 
          sortedModels[key] = (models as any).sort((a: any, b: any) => b.name.length - a.name.length),
      );

      return sortedModels;

    }


  const initModelOption = () => {
      return modelOptionFlags.reduce((acc:{[key:string]:boolean}, x) => {
        const k = x.key as ModelKey;
        const allModels = availableModels && Object.keys(availableModels).includes(k) ? availableModels[k] : []; 
        acc[x.key] =  allModels.length > 0 && allModels.every((model: any) => !hiddenModelIds.includes(model.id));
        return acc;
      }, {});
  }
  const availableModels: Record<ModelKey, any[]> = getAvailableModels();
  
  const [featureOptions, setFeatureOptions] = useState<{ [key: string]: boolean }>(initSettingsRef.current?.featureOptions);
  const [theme, setTheme] = useState<Theme>(initSettingsRef.current?.theme);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [modelOptions, setModelOptions] = useState<{ [key: string]: boolean }>(initModelOption());


  const featuresChanged = () => {
    return JSON.stringify(featureOptions) !== JSON.stringify(initSettingsRef.current?.featureOptions);
  }
  useEffect(() => {
    if (open) statsService.openSettingsEvent();
  }, [open])

  useEffect(()=> {

    const hasChanges = theme !== initSettingsRef.current?.theme || featuresChanged() ||
                       JSON.stringify(hiddenModelIds) !== JSON.stringify(initSettingsRef.current?.hiddenModelIds);
    setHasUnsavedChanges(hasChanges);

  }, [theme, featureOptions, hiddenModelIds])




  const handleSave = async () => {
    if (Object.values(allAvailableModels).every((model: Model) => hiddenModelIds.includes(model.id))) {
        alert("All models are currently set to be hidden. At least one model needs to remain visible, please adjust your selection.");
        return;
    }

    if (theme !== initSettingsRef.current?.theme) statsService.setThemeEvent(theme);
    homeDispatch({ field: 'lightMode', value: theme });

    const updatedSettings: Settings = { theme: theme, 
                                        featureOptions: featureOptions, 
                                        hiddenModelIds: hiddenModelIds
                                      }
    statsService.saveSettingsEvent(updatedSettings);
    // console.log(updatedSettings);
    saveSettings(updatedSettings);
    onClose();
    // update plugin in selector according to new feature settings
    if (featuresChanged()) window.dispatchEvent(new Event('updateFeatureSettings'));

   const result = await saveUserSettings(updatedSettings);
    if (!result) {
      alert("Settings failed to update in the cloud at the time. However, your changes have been saved and applied locally within this browser. ");
    } else {
      toast("Settings saved succsessully");
    }

  };

  useEffect(() => {
    if (availableModels) {
      const updatedModelOptions = {...modelOptions};
      Object.keys(availableModels).forEach((key: ModelKey) => {
        const allVisible =  Object.keys(availableModels).includes(key) && availableModels[key].every((model: any) => !hiddenModelIds.includes(model.id));
        updatedModelOptions[key] = allVisible;
      });
  
      if (JSON.stringify(modelOptions) !== JSON.stringify(updatedModelOptions)) setModelOptions(updatedModelOptions);
    }
    // console.log(hiddenModelIds);
  }, [hiddenModelIds])

  const handleModelOptionChange = (key: ModelKey, isChecked: boolean) => {
    setModelOptions({...modelOptions, [key]: isChecked});
    const optionModels = availableModels[key as ModelKey];
    if (isChecked) {
      const optionModelsIds = optionModels.map((m:any) => m.id);
      setHiddenModelIds(hiddenModelIds.filter((id: string) => !optionModelsIds.includes(id)));
    } else {
      const hiddenModelSet = new Set(hiddenModelIds);
      optionModels.forEach((m: any) => hiddenModelSet.add(m.id));
      setHiddenModelIds(Array.from(hiddenModelSet));
    }
  }

const modelLabel = (modelId: string, name: string) => {
  const isVisible = !hiddenModelIds.includes(modelId);
  const isDisabled = modelId === defaultModelId;
  return <div key={modelId} className={` text-sm ${isVisible ? "text-[#B91C1C]" : ""}`}> 
          <button
            disabled={isDisabled}
            title={isDisabled? "Default model can't be hidden": `${isVisible ? "Hide" : "Show"} model from selection menus`}
            className={`p-1 ${!isDisabled ? "hover:opacity-70": ""} whitespace-nowrap overflow-hidden text-ellipsis`}
            onClick={()=>{
              if (isVisible) {
                setHiddenModelIds([...hiddenModelIds, modelId]);
              } else {
                setHiddenModelIds(hiddenModelIds.filter((id: string) => id !== modelId));
              }
            }}
          >
            {name}
          </button>
   </div>
}

  // Render nothing if the dialog is not open.
  if (!open) {
    return <></>;
  }


  // Render the dialog.
  return <Modal 
      width={() => window.innerWidth * 0.62}
      height={() => window.innerHeight * 0.88}
      title={`Settings`}
      onCancel={() => onClose()} 
      onSubmit={() => handleSave()
      }
      submitLabel={"Save"}
      disableSubmit={!hasUnsavedChanges}
      content={
        <div className="text-black dark:text-neutral-200">
        <ActiveTabs
            width={() => window.innerWidth * 0.58}
            tabs={[
      
              ///////////////////////////////////////////////////////////////////////////////
                              // Configurations Tab
              
                        {label: `Configurations${hasUnsavedChanges ? " * " : ""}`, 
                          title: hasUnsavedChanges ? "Contains Unsaved Changes " : "Customize your Amplify experience",
                          content:
              
                          <>
                              <div className="flex flex-row text-lg font-bold mb-2 text-black dark:text-neutral-200">
                                {t('Theme')}
                              </div>
              
                              <div className="flex flex-row gap-6 mb-8">
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="theme"
                                    value="dark"
                                    checked={theme === 'dark'}
                                    onChange={(event) => {
                                      setTheme(event.target.value as Theme);
                                    }}
                                    className="form-radio cursor-pointer"
                                  />
                                  <span className="ml-2 text-neutral-700 dark:text-neutral-200">{t('Dark mode')}</span>
                                </label>
                                      
                                <label className="flex items-center">
                                  <input
                                    type="radio"
                                    name="theme"
                                    value="light"
                                    checked={theme === 'light'}
                                    onChange={(event) => {
                                      setTheme(event.target.value as Theme);
                                    }}
                                    className="form-radio cursor-pointer"
                                  />
                                  <span className="ml-2 text-neutral-700 dark:text-neutral-200">{t('Light mode')}</span>
                                </label>
                              </div>
              
                              { Object.keys(allAvailableModels).length > 0 && <>
                              <div className="mt-2 text-lg font-bold text-black dark:text-neutral-200">
                                {t('Models')}
                              </div>
                              
                              <div className='flex flex-row w-full'>
                                    <label className='ml-5 mt-[12px] text-[0.75rem] text-[#8B7355]'>Include All</label>
                                    <div className='flex-grow'>
                                      <div className='flex flex-col text-center mt-[-4px] text-[#8B7355]'> Available Models 
                                          <label className='ml-2 text-xs mb-2 mt-[-4px] text-[#8B7355]'>{"(Displayed models are shown in red)"}</label>
                                      </div>
                                    </div> 
                              </div>      
                              <div className='flex flex-row pr-8'>
                                <div className='w-[100px] border border-[#8B7355] mr-[-1px] mt-[-2px] dark:border-[#8B7355] px-2'>
                                  <div className='mt-1'>
                                    <FlagsMap 
                                      id={'modelOptionFlags'}
                                      flags={modelOptionFlags.filter((f: Flag) => availableModels[f.key].length > 0 )}
                                      state={modelOptions}
                                      flagChanged={(key, value) => {
                                        handleModelOptionChange(key as ModelKey, value);
                                      }}
                                    /> 
                                  </div> 
                                </div>
              
                                  <div className="overflow-x-auto w-full">
                                    <table className="table-auto border-collapse w-full">
                                      <tbody>
                                        {Object.values(availableModels).map((modelsArray, rowIndex) => (
                                          <tr key={rowIndex}>
                                            {modelsArray.map((m: { id: string; name: string }) => (
                                              <td
                                                key={m.id}
                                                className="border border-[#8B7355] dark:border-[#8B7355] px-4"
                                              >
                                                {modelLabel(m.id, m.name)}
                                              </td>
                                            ))}
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
              
                              </div>
                                    
                              </>}
                              <div className="mt-4 mb-2 text-lg font-bold text-black dark:text-neutral-200">
                                {t('Features')}
                              </div>
                              <div className='pr-4'>
                              <FlagsMap 
                                id={'featureOptionFlags'}
                                flags={featureOptionFlags.filter((f: Flag) => Object.keys(initSettingsRef.current ? initSettingsRef.current.featureOptions: {}).includes(f.key))}
                                state={featureOptions}
                                flagChanged={(key, value) => {
                                  setFeatureOptions({...featureOptions, [key]: value});
                                }}
                              />
                              </div>
                            
                          </>
                        },
              
              ///////////////////////////////////////////////////////////////////////////////
                              // Conversation Storage
              
                      {label: `Conversation Storage`, 
                        title: "Enable conversations to sync across devices or keep them priavte",
                        content: <>
                          {featureFlags.storeCloudConversations && 
                                <StorageDialog open={open} />
                              }
                        </>
                        
                      },
              ///////////////////////////////////////////////////////////////////////////////
                              // Legacy Workspaces
                      ...(workspaces && workspaces.length > 0 ? 
                        [{ label: `Legacy Workspaces`, 
                           title: hasUnsavedChanges ? " Contains Unsaved Changes  " : "",
                           content: <LegacyWorkspaces/>
                        }] : [])
                    ]}
      />
      </div>
      }
    />
                
};




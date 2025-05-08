import { IconExternalLink, IconCloud } from '@tabler/icons-react';
import { useContext, useEffect, useState } from 'react';

import { useTranslation } from 'next-i18next';

import { Model } from '@/types/model';

import HomeContext from '@/pages/api/home/home.context';
import { filterModels } from '@/utils/app/models';
import { getSettings } from '@/utils/app/settings';
import HelpOverlay from '@/components/Help/HelpOverlay';

interface Props {
  modelId: string | undefined;
  isDisabled?: boolean;
  handleModelChange?: (e: string) => void
  isTitled?: boolean;
  applyModelFilter?:boolean;
  disableMessage?: string;
}


export const ModelSelect: React.FC<Props> = ({modelId, isDisabled=false, handleModelChange, isTitled=true, applyModelFilter = true,
                                              disableMessage = "Model has been predetermined and can not be changed"}) => {
  const { t } = useTranslation('chat');
  const {
    state: { selectedConversation, defaultModelId, featureFlags, availableModels}, 
    handleUpdateConversation,
  } = useContext(HomeContext);

  const [selectModel, setSelectModel] = useState<string | undefined>(modelId ?? defaultModelId);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const models = applyModelFilter ? filterModels(availableModels, getSettings(featureFlags).hiddenModelIds) : Object.values(availableModels);

  useEffect(()=>{
    setSelectModel(modelId);
    // edge case in component use in Assistant Admin ui
    if (!isDisabled && handleModelChange && !modelId && defaultModelId) {handleModelChange(defaultModelId)}; 
  }
  ,[modelId, isDisabled]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const updatedModel = e.target.value;
    if (handleModelChange) {
      handleModelChange(updatedModel);
    } else {
      selectedConversation &&
      handleUpdateConversation(selectedConversation, {
        key: 'model',
        value: models.find(
          (model: Model) => model.id === updatedModel,
        ),
      });
    }
    setSelectModel(updatedModel);
    
  };
  
  return (
    <div className="flex flex-col">
      <div className="flex items-center mb-2">
        <label className="text-left text-black dark:text-white mr-2">
          {isTitled? t('Model'): ""}
        </label>
        <button
          className="flex flex-shrink-0 items-center justify-center w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors duration-200 text-sm"
          onClick={() => setIsHelpOpen(true)}
          title="Help"
        >
          ?
        </button>
      </div>
      <div className="w-full rounded-lg border border-neutral-200 bg-transparent pr-2 text-neutral-900 dark:border-neutral-600 dark:text-white custom-shadow">
        <select
          disabled={isDisabled}
          className="w-full bg-transparent p-2"
          placeholder={t('Select a model') || ''}
          value={selectModel}
          onChange={handleChange}
          title={isDisabled ? disableMessage : "Select Model"}
        >
          {models.map((model: Model) => (
            <option
              key={model.id}
              value={model.id}
              className="dark:bg-[#343541] dark:text-white"
              title={model.description}
            >
              {model.id === defaultModelId
                ? `Default (${model.name})`
                : model.name}
            </option>
          ))}
        </select>
      </div>
      <HelpOverlay isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} type="model" />
    </div>
  );
};
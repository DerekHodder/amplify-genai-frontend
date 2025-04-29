import { IconX } from '@tabler/icons-react';
import { FC } from 'react';

import { useTranslation } from 'next-i18next';

interface Props {
  placeholder: string;
  searchTerm: string;
  onSearch: (searchTerm: string) => void;
  disabled?: boolean;
  paddingY?: string;
}
const Search: FC<Props> = ({ placeholder, searchTerm, onSearch, disabled=false, paddingY="py-3"}) => {
  const { t } = useTranslation('sidebar');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    onSearch('');
  };

  return (
    <div className="relative flex items-center">
      <input
        className={`w-full flex-1 rounded-md border border-[#8B7355] dark:border-[#8B7355] bg-white dark:bg-[#8B7355]/10 px-4 ${paddingY} pr-10 text-[14px] leading-3 text-white dark:text-white placeholder:text-[#8B7355]/50 dark:placeholder:text-[#D4C5B4]/50`}
        type="text"
        placeholder={t(placeholder) || ''}
        value={searchTerm}
        onChange={handleSearchChange}
        disabled={disabled}
        autoComplete={'off'}
        spellCheck={false}
      />

      {searchTerm && (
        <IconX
          className="absolute right-4 cursor-pointer text-[#8B7355] hover:text-[#8B7355]/70 dark:text-[#8B7355] dark:hover:text-[#8B7355]/70"
          size={18}
          onClick={clearSearch}
        />
      )}
    </div>
  );
};

export default Search;

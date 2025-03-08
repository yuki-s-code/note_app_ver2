// SearchFilter.tsx

import React, { FC, useCallback, useEffect, useState } from "react";
import { Input, Select, Option, Button } from "@material-tailwind/react";
import { Search } from "lucide-react";

interface SearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedCategory: string;
  setSelectedCategory: (categoryId: string) => void;
  categories: {
    id: string;
    category: string;
  }[];
}

const SearchFilter: FC<SearchFilterProps> = React.memo(
  ({
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    categories,
  }) => {
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

    useEffect(() => {
      const handler = setTimeout(() => {
        setSearchTerm(debouncedSearchTerm);
      }, 300); // 300ms のデバウンス

      return () => {
        clearTimeout(handler);
      };
    }, [debouncedSearchTerm, setSearchTerm]);

    // ハンドラーを useCallback でメモ化
    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setDebouncedSearchTerm(e.target.value);
        console.log("Search Term Changed:", e.target.value);
      },
      []
    );

    const handleCategoryChange = useCallback(
      (value: any) => {
        setSelectedCategory(value);
        console.log("Category Selected:", value);
      },
      [setSelectedCategory]
    );

    const handleReset = useCallback(() => {
      setSearchTerm("");
      setSelectedCategory("");
      console.log("Filters Reset");
    }, [setSearchTerm, setSelectedCategory]);

    return (
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-2">
        <Input
          crossOrigin="true"
          onPointerEnterCapture
          onPointerLeaveCapture
          label="検索"
          value={debouncedSearchTerm}
          onChange={handleSearchChange}
          icon={<Search className="h-4 w-4 text-gray-400" aria-hidden="true" />}
          className="w-full"
          aria-label="検索"
        />
        <Select
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
          label="カテゴリー"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full"
          aria-label="カテゴリー"
        >
          <Option value="">全て</Option>
          {categories.map((cat) => (
            <Option key={cat.id} value={cat.id}>
              {cat.category}
            </Option>
          ))}
        </Select>
        <Button
          size="sm"
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
          variant="outlined"
          color="gray"
          onClick={handleReset}
          aria-label="リセット"
        >
          リセット
        </Button>
      </div>
    );
  }
);

export default SearchFilter;

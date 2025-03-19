// 完成版 SynonymManager.tsx（編集機能付き）
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  Chip,
  IconButton,
  Input,
} from "@material-tailwind/react";
import { PlusIcon, X, Pencil, Trash2Icon } from "lucide-react";
import { useQuerySynonyms } from "@/libs/hooks/noteHook/useQueryBot";

interface SynonymManagerProps {
  word: string;
  setWord: (word: string) => void;
  synonyms: string[];
  onAddSynonym: (synonym: string) => void;
  onRemoveSynonym: (index: number) => void;
  candidateWords: string[];
  handleDeleteSynonym: (id: string) => void;
  handleEditSynonym: (synonym: any) => void;
}

const SynonymManager: React.FC<SynonymManagerProps> = ({
  word,
  setWord,
  synonyms,
  onAddSynonym,
  onRemoveSynonym,
  candidateWords,
  handleDeleteSynonym,
  handleEditSynonym,
}) => {
  const [input, setInput] = useState("");
  const [showList, setShowList] = useState(false);

  const { data: synonymData, isLoading, isError } = useQuerySynonyms();

  return (
    <Card
      placeholder
      onPointerEnterCapture
      onPointerLeaveCapture
      className="p-4"
    >
      <CardHeader
        placeholder
        onPointerEnterCapture
        onPointerLeaveCapture
        className="mb-4"
      >
        <Typography
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          variant="h6"
        >
          表現ゆれ（Synonym）管理
        </Typography>
      </CardHeader>

      <CardBody placeholder onPointerEnterCapture onPointerLeaveCapture>
        {/* 基本語入力 */}
        <div className="mb-4">
          <Typography
            placeholder
            onPointerEnterCapture
            onPointerLeaveCapture
            variant="small"
            color="gray"
          >
            基本語
          </Typography>
          <Input
            crossOrigin
            onPointerEnterCapture
            onPointerLeaveCapture
            className="border p-2 rounded w-full"
            placeholder="基本語を入力"
            value={word}
            onChange={(e) => setWord(e.target.value)}
          />
        </div>

        {/* Synonym追加 */}
        <div className="flex gap-2 mb-4">
          <Input
            crossOrigin
            onPointerEnterCapture
            onPointerLeaveCapture
            className="border p-2 rounded w-full"
            placeholder="新しい表現を入力"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button
            placeholder
            onPointerEnterCapture
            onPointerLeaveCapture
            color="blue"
            onClick={() => {
              if (input.trim()) {
                onAddSynonym(input.trim());
                setInput("");
              }
            }}
          >
            追加
          </Button>
        </div>

        {/* 候補リスト */}
        <div className="mb-4">
          <Typography
            placeholder
            onPointerEnterCapture
            onPointerLeaveCapture
            variant="small"
            color="gray"
          >
            候補から追加
          </Typography>
          <div className="flex flex-wrap gap-2 mt-2">
            {candidateWords.map((word, index) => (
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                key={index}
                color="gray"
                size="sm"
                onClick={() => onAddSynonym(word)}
              >
                {word}
              </Button>
            ))}
          </div>
        </div>

        {/* 登録予定のSynonymリスト */}
        <div className="flex flex-wrap gap-2 mb-4">
          {synonyms.map((word, index) => (
            <Chip
              key={index}
              value={word}
              color="blue"
              icon={
                <IconButton
                  className=" -ml-2 -mt-1"
                  placeholder
                  onPointerEnterCapture
                  onPointerLeaveCapture
                  variant="text"
                  size="sm"
                  onClick={() => onRemoveSynonym(index)}
                >
                  <X className="w-4 h-4" />
                </IconButton>
              }
            />
          ))}
        </div>

        {/* 一覧表示トグルボタン */}
        <Button
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          color="green"
          onClick={() => setShowList(!showList)}
          className="mb-4"
        >
          {showList ? "一覧を閉じる" : "登録済みSynonym一覧を表示"}
        </Button>

        {/* 登録済みSynonym一覧（NeDBから取得） */}
        {showList && (
          <div className="bg-gray-50 p-4 rounded shadow-inner">
            {isLoading && <p>読み込み中...</p>}
            {isError && <p>取得エラー</p>}
            {synonymData && synonymData.length > 0 ? (
              // スクロール領域
              <div className="overflow-y-auto max-h-64">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead className="bg-blue-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 text-left border">基本語</th>
                      <th className="p-2 text-left border">表現</th>
                      <th className="p-2 text-center border">操作</th>
                    </tr>
                  </thead>
                  <tbody className=" text-sm">
                    {synonymData.map((synonym: any) => (
                      <tr key={synonym.id} className="border-b">
                        <td className="p-2 border">
                          <div className="max-w-[200px] max-h-12 overflow-auto whitespace-nowrap">
                            {synonym.word}
                          </div>
                        </td>
                        <td className="p-2 border">
                          <div className="max-w-[300px] max-h-12 overflow-auto whitespace-nowrap">
                            {synonym.synonyms.join(", ")}
                          </div>
                        </td>
                        <td className="p-2 border text-center flex gap-2 justify-center">
                          <Button
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            color="blue"
                            size="sm"
                            onClick={() => handleEditSynonym(synonym)}
                            className="flex items-center gap-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            placeholder
                            onPointerEnterCapture
                            onPointerLeaveCapture
                            color="red"
                            size="sm"
                            onClick={() => handleDeleteSynonym(synonym.id)}
                          >
                            <Trash2Icon className=" w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>登録されたSynonymはありません。</p>
            )}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default SynonymManager;

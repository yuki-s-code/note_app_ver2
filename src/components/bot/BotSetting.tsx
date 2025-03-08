// BotSetting.tsx

import React, { useState, useMemo, FC, useCallback } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
  CardFooter,
} from "@material-tailwind/react";
import { ChevronDown, PencilIcon, PlusIcon, X, Trash2Icon } from "lucide-react";
import { BotCreate } from "./BotCreate";
import {
  useQueryBot,
  useQueryBotCategory,
  useQueryIntents,
} from "@/libs/hooks/noteHook/useQueryBot";
import { ErrorComponent } from "./ErrorComponent";
import { BotEdit } from "./BotEdit";
import InfiniteScroll from "react-infinite-scroll-component";
import SearchFilter from "./SearchFilter";
import { Category, Intent } from "./types/types";
import { IntentManager } from "./IntentManager";
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import toast from "react-hot-toast";
import SuccessToast from "../atoms/toast/SuccessToast";
import ErrorToast from "../atoms/toast/ErrorToast"; // ErrorToast をインポート
import { Loding } from "../atoms/fetch/Loding";

export interface ModelStyle {
  id: string;
  category: Category[];
  intentId: string;
  questions: string[];
  answer: string;
  keywords: string[] | null;
  relatedFAQs: { question: string; answer: string }[];
}

const TABLE_HEAD = ["質問", "回答", "カテゴリー", "インテント", "操作"]; // 最後の列を「操作」に変更

const getContrastingTextColor = (bgColor: string): string => {
  const color = bgColor.substring(1); // '#'を除去
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? "#000000" : "#FFFFFF";
};

export const BotSetting: FC<{ setEditedOpen: (open: boolean) => void }> = ({
  setEditedOpen,
}) => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedBot, setSelectedBot] = useState<ModelStyle | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [intentManagerOpen, setIntentManagerOpen] = useState(false);

  const {
    data: botData,
    status: botStatus,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchBot,
  } = useQueryBot();

  const {
    data: categoryData,
    status: categoryStatus,
    refetch: refetchCategory,
  } = useQueryBotCategory();

  const {
    data: intentsData,
    status: intentsStatus,
    refetch: refetchIntents,
  } = useQueryIntents();

  // ★ 追加: 手動トレーニング用
  const { deleteBot, trainNLP } = useMutateBot();

  const bots = useMemo(() => {
    if (!botData) return [];
    return botData.pages.flatMap((page: any) => page.docs);
  }, [botData]);

  const categories = useMemo(() => categoryData || [], [categoryData]);
  const intents = useMemo(() => intentsData || [], [intentsData]);

  // インテントIDからインテント名を取得する関数
  const getIntentName = useCallback(
    (intentId: string): string => {
      const intent = intents.find((intent: Intent) => intent.id === intentId);
      return intent ? intent.name : "不明なインテント";
    },
    [intents]
  );

  // category の ID に基づいてカテゴリーオブジェクトをマッピング
  const updatedBots = useMemo(() => {
    return bots.map((bot: any) => {
      const mappedCategories = bot.category
        .map((catId: string) => {
          return categories.find((cat: Category) => cat.id === catId) || null;
        })
        .filter((cat: Category | null) => cat !== null) as Category[];

      return {
        ...bot,
        category: mappedCategories,
      };
    });
  }, [bots, categories]);

  const handleDelete = useCallback(
    (botId: string) => {
      deleteBot.mutate(botId, {
        onSuccess: () => {
          toast.custom((t) => <SuccessToast message="削除が成功しました。" />, {
            duration: 3000,
            position: "top-right",
          });
        },
        onError: () => {
          toast.custom((t) => <ErrorToast message="削除に失敗しました。" />, {
            duration: 5000,
            position: "top-right",
          });
        },
      });
    },
    [deleteBot]
  );

  // ボットデータのフィルタリング
  const filteredBots = useMemo(() => {
    return updatedBots.filter((bot: ModelStyle) => {
      const matchesSearch =
        bot.questions.some((question: string) =>
          question.toLowerCase().includes(searchTerm.toLowerCase())
        ) || bot.answer.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = selectedCategory
        ? bot.category.some((cat: Category) => cat.id === selectedCategory)
        : true;

      return matchesSearch && matchesCategory;
    });
  }, [updatedBots, searchTerm, selectedCategory]);

  // 閉じるハンドラー
  const handleClose = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("");
    setEditedOpen(false);
    setEditOpen(false);
    setCreateOpen(false);
    localStorage.removeItem("bot_answers");
  }, [setEditedOpen]);

  // 削除の確認ダイアログを表示する関数
  const confirmDelete = useCallback(
    (botId: string) => {
      confirmAlert({
        title: "確認",
        message: "このBotを削除してもよろしいですか？",
        buttons: [
          {
            label: "はい",
            onClick: () => handleDelete(botId),
          },
          {
            label: "いいえ",
            onClick: () => {},
          },
        ],
      });
    },
    [handleDelete]
  );

  // Botの削除処理

  // ローディングやエラー状態のハンドリング
  if (
    botStatus === "loading" ||
    categoryStatus === "loading" ||
    intentsStatus === "loading"
  ) {
    return <Loding />;
  }

  if (
    botStatus === "error" ||
    categoryStatus === "error" ||
    intentsStatus === "error"
  ) {
    return (
      <Card
        className="h-screen w-screen flex flex-col bg-red-50"
        placeholder
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        <CardHeader
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          className="mb-4 p-4"
        >
          <div className="flex items-center justify-between gap-8">
            <Typography
              placeholder
              onPointerEnterCapture
              onPointerLeaveCapture
              variant="h5"
              color="blue-gray"
            >
              Bot管理画面
            </Typography>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-3"
                size="sm"
                color="red"
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> 新規作成
              </Button>
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={handleClose}
                className="flex items-center gap-3"
                size="sm"
                color="gray"
              >
                <X strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardBody
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          className="flex-1 flex items-center justify-center bg-red-100"
        >
          <ErrorComponent
            onRetry={() => {
              refetchBot();
              refetchCategory();
              refetchIntents();
            }}
          />
        </CardBody>
        <CardFooter
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          className="flex items-center justify-between border-t border-blue-gray-50 p-4"
        >
          <Typography
            placeholder
            onPointerEnterCapture
            onPointerLeaveCapture
            variant="small"
            color="blue-gray"
            className="font-normal"
          >
            エラーが発生しました
          </Typography>
        </CardFooter>
      </Card>
    );
  }

  return (
    <>
      {/* データが正常に取得できた場合の表示 */}
      <Card
        placeholder
        onPointerEnterCapture
        onPointerLeaveCapture
        className="h-screen w-screen flex flex-col"
      >
        <CardHeader
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          floated={false}
          shadow={false}
          className="rounded-none p-4 bg-blue-gray-50"
        >
          <div className="mb-2 flex items-center justify-between gap-8">
            <Typography
              placeholder
              onPointerEnterCapture
              onPointerLeaveCapture
              variant="h5"
              color="blue-gray"
            >
              Bot管理画面
            </Typography>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={() => setCreateOpen(true)}
                className="flex items-center gap-3"
                size="sm"
                color="blue"
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> 新規作成
              </Button>
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={() => setIntentManagerOpen(true)}
                className="flex items-center gap-3 ml-4"
                size="sm"
                color="indigo"
              >
                インテント管理
              </Button>
              {/* ★ 学習ボタン追加 */}
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={() => {
                  // NLP学習を手動で開始
                  trainNLP.mutate(undefined, {
                    onSuccess: () => {
                      toast.custom(
                        (t) => (
                          <SuccessToast message="NLPの学習をトリガーしました。" />
                        ),
                        {
                          duration: 3000,
                          position: "top-right",
                        }
                      );
                    },
                    onError: () => {
                      toast.custom(
                        (t) => (
                          <ErrorToast message="NLPトレーニングリクエストに失敗しました。" />
                        ),
                        {
                          duration: 5000,
                          position: "top-right",
                        }
                      );
                    },
                  });
                }}
                className="flex items-center gap-3 ml-4"
                size="sm"
                color="teal"
              >
                NLP手動トレーニング
              </Button>
              <Button
                placeholder
                onPointerEnterCapture
                onPointerLeaveCapture
                onClick={handleClose}
                className="flex items-center gap-3 ml-12"
                size="sm"
                color="gray"
              >
                <X strokeWidth={2} className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          id="bot-table-body"
          className="hover-scrollbar overflow-auto px-4 flex-1 bg-white"
        >
          <div className="mb-4">
            <SearchFilter
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
            />
          </div>
          <InfiniteScroll
            dataLength={filteredBots.length}
            next={fetchNextPage}
            hasMore={!!hasNextPage}
            loader={<h4 className="text-center">読み込み中...</h4>}
            scrollableTarget="bot-table-body"
            endMessage={
              <p className="text-center">
                <b>これ以上のデータはありません</b>
              </p>
            }
          >
            <table
              className="w-full table-auto text-left"
              role="table"
              aria-label="Bot一覧"
            >
              <thead>
                <tr role="row">
                  {TABLE_HEAD.map((head, index) => (
                    <th
                      key={head}
                      className="cursor-pointer border-b border-blue-gray-100 bg-blue-gray-50 p-2"
                      role="columnheader"
                      scope="col"
                    >
                      <Typography
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        variant="small"
                        color="blue-gray"
                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70 text-sm sm:text-base"
                      >
                        {head}
                        {index !== TABLE_HEAD.length - 1 && (
                          <ChevronDown
                            strokeWidth={2}
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredBots.map((bot: ModelStyle) => (
                  <tr key={bot.id}>
                    {/* 質問表示 */}
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex items-start w-[400px] gap-3">
                        <ul className="list-disc pl-5">
                          {bot.questions.map((question, idx) => (
                            <li key={idx}>
                              <Typography
                                placeholder
                                onPointerEnterCapture
                                onPointerLeaveCapture
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                              >
                                {question}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </td>

                    {/* 回答表示 */}
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        variant="small"
                        color="blue-gray"
                        className="font-normal w-[300px]"
                      >
                        {bot.answer}
                      </Typography>
                    </td>

                    {/* カテゴリー表示 */}
                    <td className="p-4 border-b border-blue-gray-50">
                      <div className="flex flex-wrap gap-2">
                        {bot.category.length > 0 ? (
                          bot.category.map((cat) => (
                            <Tooltip
                              key={cat.id}
                              content={cat.category}
                              placement="top"
                            >
                              <div
                                className="px-2 py-1 rounded-full text-xs font-semibold max-w-xs truncate cursor-pointer"
                                style={{
                                  backgroundColor: cat.color,
                                  color: getContrastingTextColor(cat.color),
                                }}
                                role="cell"
                                aria-label={`カテゴリー: ${cat.category}`}
                              >
                                {cat.category.length > 20
                                  ? `${cat.category.slice(0, 20)}...`
                                  : cat.category}
                              </div>
                            </Tooltip>
                          ))
                        ) : (
                          <span className="text-gray-500 text-xs">
                            カテゴリーなし
                          </span>
                        )}
                      </div>
                    </td>

                    {/* インテント表示 */}
                    <td className="p-4 border-b border-blue-gray-50">
                      <Typography
                        placeholder
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        variant="small"
                        color="blue-gray"
                        className="font-normal w-[300px]"
                      >
                        {getIntentName(bot.intentId)}
                      </Typography>
                    </td>

                    {/* 編集・削除ボタン */}
                    <td className="p-4 border-b border-blue-gray-50 flex space-x-2">
                      <Tooltip content="編集">
                        <IconButton
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                          variant="text"
                          onClick={() => {
                            setSelectedBot(bot);
                            setEditOpen(true);
                          }}
                          tabIndex={0}
                          aria-label={`編集 ${bot.id}`}
                          className="transition-transform transform hover:scale-110"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip content="削除">
                        <IconButton
                          placeholder
                          onPointerEnterCapture
                          onPointerLeaveCapture
                          variant="text"
                          onClick={() => confirmDelete(bot.id)}
                          tabIndex={0}
                          aria-label={`削除 ${bot.id}`}
                          className="transition-transform transform hover:scale-110"
                        >
                          <Trash2Icon className="h-4 w-4 text-red-500" />
                        </IconButton>
                      </Tooltip>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </InfiniteScroll>
          {isFetchingNextPage && <h4 className="text-center">読み込み中...</h4>}
        </CardBody>
        <CardFooter
          placeholder
          onPointerEnterCapture
          onPointerLeaveCapture
          className="flex items-center justify-between border-t border-blue-gray-50 p-4"
        >
          <Typography
            placeholder
            onPointerEnterCapture
            onPointerLeaveCapture
            variant="small"
            color="blue-gray"
            className="font-normal"
          >
            Bot管理画面
          </Typography>
        </CardFooter>
      </Card>

      {/* 新規作成モーダル */}
      {createOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75"
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-bot-title"
        >
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-5xl max-h-full overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 id="create-bot-title" className="text-xl font-bold">
                Botを新規作成
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setCreateOpen(false)}
                aria-label="閉じる"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <BotCreate setCreateOpen={setCreateOpen} />
          </div>
        </div>
      )}

      {/* 編集モーダル */}
      {editOpen && selectedBot && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-bot-title"
        >
          <div className="bg-white w-full max-w-3xl mx-auto rounded shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 id="edit-bot-title" className="text-xl font-bold">
                Botを編集
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setEditOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <BotEdit
                botData={selectedBot}
                onClose={() => setEditOpen(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* インテント管理モーダル */}
      {intentManagerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="intent-manager-title"
        >
          <div className="bg-white w-full max-w-5xl mx-auto rounded shadow-lg overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 id="intent-manager-title" className="text-xl font-bold">
                インテント管理
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIntentManagerOpen(false)}
                aria-label="閉じる"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <IntentManager />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BotSetting;

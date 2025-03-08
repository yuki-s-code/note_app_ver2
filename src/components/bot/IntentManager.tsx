// IntentManager.tsx

import React, { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  Typography,
  Button,
  CardBody,
  IconButton,
  Tooltip,
} from "@material-tailwind/react";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  useQueryIntents,
  useQueryBotCategory,
} from "@/libs/hooks/noteHook/useQueryBot"; // useQueryBotCategory を追加
import { Loding } from "../atoms/fetch/Loding";
import { ErrorComponent } from "./ErrorComponent";
import { IntentCreateModal } from "./IntentCreateModal";
import { IntentEditModal } from "./IntentEditModal";
import { Category, Intent } from "./types/types"; // Category 型をインポート
import { useMutateBot } from "@/libs/hooks/noteHook/useMutateBot";

export const IntentManager: React.FC = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedIntent, setSelectedIntent] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm]: any = useState<{
    open: boolean;
    intent: Intent | null;
  }>({
    open: false,
    intent: null,
  });
  const { deleteIntent } = useMutateBot(); // deleteIntent を取得

  const {
    data: intentsData,
    status: intentsStatus,
    refetch,
  } = useQueryIntents();

  const {
    data: categoriesData,
    status: categoriesStatus,
    refetch: refetchCategories,
  } = useQueryBotCategory(); // カテゴリーのデータを取得

  const intents = useMemo(() => {
    return intentsData || [];
  }, [intentsData]);

  const categories = useMemo(() => {
    return categoriesData || [];
  }, [categoriesData]);

  // カテゴリーIDをカテゴリー名にマッピングする関数
  const getCategoryName = (categoryId: string): string => {
    const category = categories.find((cat: Category) => cat.id === categoryId);
    return category ? category.category : "不明なカテゴリー";
  };

  // インテント削除のハンドラー
  const handleDelete = (intent: Intent) => {
    setDeleteConfirm({ open: true, intent });
  };

  // 確認ダイアログでの削除確定ハンドラー
  const confirmDelete = () => {
    if (deleteConfirm.intent) {
      deleteIntent.mutate(deleteConfirm.intent.id, {
        onSuccess: () => {
          refetch();
          setDeleteConfirm({ open: false, intent: null });
        },
        onError: (error: any) => {
          console.error("インテントの削除に失敗しました:", error);
          setDeleteConfirm({ open: false, intent: null });
        },
      });
    }
  };
  // 確認ダイアログのキャンセルハンドラー
  const cancelDelete = () => {
    setDeleteConfirm({ open: false, intent: null });
  };

  if (intentsStatus === "loading" || categoriesStatus === "loading") {
    return <Loding />;
  }

  if (intentsStatus === "error" || categoriesStatus === "error") {
    return (
      <ErrorComponent
        onRetry={() => {
          refetch();
          refetchCategories();
        }}
      />
    );
  }

  return (
    <>
      <Card
        className="w-full"
        placeholder="true"
        onPointerEnterCapture
        onPointerLeaveCapture
      >
        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-none"
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
        >
          <div className="mb-2 flex items-center justify-between gap-8">
            <div>
              <Typography
                variant="h5"
                color="blue-gray"
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
              >
                管理画面
              </Typography>
            </div>
            <div className="flex shrink-0 flex-col sm:flex-row">
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                className="flex items-center gap-3"
                size="sm"
                onClick={() => setCreateOpen(true)}
              >
                <PlusIcon strokeWidth={2} className="h-4 w-4" /> 新規作成
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody
          className="overflow-auto px-0"
          placeholder="true"
          onPointerEnterCapture
          onPointerLeaveCapture
        >
          <table className="w-full table-auto text-left">
            <thead>
              <tr>
                <th className="p-4 border-b border-blue-gray-50">
                  インテント名
                </th>
                <th className="p-4 border-b border-blue-gray-50">
                  カテゴリー名
                </th>
                <th className="p-4 border-b border-blue-gray-50">説明</th>
                <th className="p-4 border-b border-blue-gray-50">編集</th>
              </tr>
            </thead>
            <tbody>
              {intents.map((intent: any) => (
                <tr key={intent.id}>
                  <td className="p-4 border-b border-blue-gray-50">
                    {intent.name}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {getCategoryName(intent.categoryId)}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50">
                    {intent.description}
                  </td>
                  <td className="p-4 border-b border-blue-gray-50 flex space-x-2">
                    <Tooltip content="編集">
                      <IconButton
                        placeholder="true"
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        variant="text"
                        onClick={() => {
                          setSelectedIntent(intent);
                          setEditOpen(true);
                        }}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip content="削除">
                      <IconButton
                        placeholder="true"
                        onPointerEnterCapture
                        onPointerLeaveCapture
                        variant="text"
                        onClick={() => handleDelete(intent)}
                      >
                        <TrashIcon className="h-4 w-4 text-red-500" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardBody>
      </Card>

      {/* 新規作成モーダル */}
      {createOpen && (
        <IntentCreateModal
          onClose={() => setCreateOpen(false)}
          onSuccess={() => {
            refetch();
            setCreateOpen(false);
          }}
        />
      )}

      {/* 編集モーダル */}
      {editOpen && selectedIntent && (
        <IntentEditModal
          intentData={selectedIntent}
          onClose={() => {
            setEditOpen(false);
            setSelectedIntent(null);
          }}
          onSuccess={() => {
            refetch();
            setEditOpen(false);
            setSelectedIntent(null);
          }}
        />
      )}
      {/* 削除確認ダイアログ */}
      {deleteConfirm.open && deleteConfirm.intent && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-75"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-confirm-title"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h2 id="delete-confirm-title" className="text-xl font-bold mb-4">
              インテントの削除
            </h2>
            <p className="mb-6">
              インテント「{deleteConfirm.intent.name}」を本当に削除しますか？
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                variant="outlined"
                color="gray"
                onClick={cancelDelete}
              >
                キャンセル
              </Button>
              <Button
                placeholder="true"
                onPointerEnterCapture
                onPointerLeaveCapture
                variant="filled"
                color="red"
                onClick={confirmDelete}
              >
                削除
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// App.tsx

import React, { Suspense } from "react";
import { MemoryRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { ErrorBoundary, FallbackProps } from "react-error-boundary";
import { DefaultSkeleton } from "./components/atoms/fetch/DefaultSkeleton";
import { Toaster } from "react-hot-toast";
import Board from "./components/board/Board";
import Note from "./components/note/Note";
import HomePage from "./components/topage/Page1";
import ErrorPage from "./components/ErrorPage";
import Root from "./routes/Root";
import Login from "./routes/Login";
import UserCreate from "./components/login/UserCreate";
import MyPage from "./components/topage/MyPage";
import MessageIlust from "./components/message/MessageIlust";
import NoteApp from "./components/note/NoteApp";
import JournalApp from "./components/note/calendar/JournalApp";
import Drawer from "./components/note/drawer/Drawer";
import JournalDrawer from "./components/note/calendar/JournalDrawer";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

// エラーフォールバックコンポーネント
const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => (
  <div className="error-fallback flex flex-col items-center justify-center min-h-screen bg-red-100">
    <p className="text-red-700">エラーが発生しました: {error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
    >
      リロード
    </button>
  </div>
);

// アプリケーションのルーティング設定
const AppRoutes: React.FC = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="*" element={<ErrorPage />} />
    <Route path="/root" element={<Root />}>
      <Route index element={<HomePage />} />
      <Route path="sign" element={<UserCreate />} />
      <Route path="profile" element={<MyPage />} />
      <Route path="news" element={<Board />} />
      <Route path="message" element={<MessageIlust />} />
      <Route path="note" element={<Note />}>
        <Route path=":noteId" element={<NoteApp />}>
          <Route path=":mentionId" element={<Drawer />} />
        </Route>
        <Route path="journals/:ymday" element={<JournalApp />}>
          <Route path=":mentionId" element={<JournalDrawer />} />
        </Route>
      </Route>
    </Route>
  </Routes>
);

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <ErrorBoundary FallbackComponent={ErrorFallback}>
        <Suspense
          fallback={
            <div className="w-10/12">
              <DefaultSkeleton />
            </div>
          }
        >
          <AppRoutes />
        </Suspense>
      </ErrorBoundary>
    </Router>
    <Toaster // Toaster を配置
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        style: {
          borderRadius: "8px",
          background: "#333",
          color: "#fff",
        },
        success: {
          duration: 3000,
          style: {
            background: "#4caf50",
            color: "#fff",
          },
        },
        error: {
          duration: 5000,
          style: {
            background: "#f44336",
            color: "#fff",
          },
        },
      }}
    />
  </QueryClientProvider>
);

export default App;

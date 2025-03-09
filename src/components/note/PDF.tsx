//PDF.tsx

import { FileBlockConfig } from "@blocknote/core";
import {
  createReactBlockSpec,
  ReactCustomBlockRenderProps,
  ResizableFileBlockWrapper,
} from "@blocknote/react";
import { RiFilePdfFill, RiSideBarLine } from "react-icons/ri";
import "./styles.css";
import { Document, Outline, Page } from "react-pdf";
//@ts-ignore
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker?worker&url";
import { useCallback, useEffect, useRef, useState } from "react";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";
import "react-pdf/dist/esm/Page/TextLayer.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import {
  BsArrowsFullscreen,
  BsDownload,
  BsZoomIn,
  BsZoomOut,
} from "react-icons/bs";

export const PDFPreview = (
  props: Omit<
    ReactCustomBlockRenderProps<FileBlockConfig, any, any>,
    "contentRef"
  >
) => {
  const [numPages, setNumPages]: any = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1); // ズーム用
  const pdfRef = useRef<HTMLDivElement>(null); // フルスクリーン用
  const [workerLoaded, setWorkerLoaded] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true); // 🔥追加
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState<number[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState(false);

  useEffect(() => {
    const exitFullScreen = (e: KeyboardEvent) => {
      if (e.key === "Escape" && document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
    document.addEventListener("keydown", exitFullScreen);
    return () => document.removeEventListener("keydown", exitFullScreen);
  }, []);

  useEffect(() => {
    const loadPdfWorker = async () => {
      try {
        // PDF.jsのワーカーパスを設定
        pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

        console.log("PDF Worker loaded from:", pdfjsWorker);
        setWorkerLoaded(true);
      } catch (error) {
        console.error("Failed to load PDF worker:", error);
        setWorkerLoaded(false);
      }
    };

    loadPdfWorker();
  }, []);

  function highlightPattern(text: string, pattern: string) {
    if (!pattern) return text;
    const regex = new RegExp(pattern, "gi");
    return text.replace(regex, (match) => `<mark>${match}</mark>`);
  }
  const textRenderer = useCallback(
    (textItem: any) => highlightPattern(textItem.str, searchText),
    [searchText]
  );

  const goToPrevPage = () =>
    setPageNumber((prev) => (prev > 1 ? prev - 1 : prev));
  const goToNextPage = () =>
    setPageNumber((prev) => (prev < numPages ? prev + 1 : prev));
  const goToPage = (page: number) => setPageNumber(page);
  const toggleSidebar = () => setShowSidebar((prev) => !prev);

  const handlePageInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const page = Number(e.target.value);
    if (page >= 1 && page <= numPages) setPageNumber(page);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.25, 3)); // 最大3倍
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.25, 0.5)); // 最小0.5倍

  const toggleFullScreen = () => {
    if (pdfRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        pdfRef.current.requestFullscreen();
      }
    }
  };

  const downloadPDF = () => {
    const a: any = document.createElement("a");
    a.href = props.block.props.url;
    a.download = "document.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  function onItemClick({ pageNumber: itemPageNumber }: any) {
    setPageNumber(itemPageNumber);
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  const performSearch = async () => {
    if (!searchText) return;

    const results: number[] = [];
    for (let i = 1; i <= numPages; i++) {
      const pageText = await extractTextFromPage(i);
      if (pageText.includes(searchText)) {
        results.push(i);
      }
    }
    setSearchResults(results);
    setCurrentSearchIndex(0);
    if (results.length > 0) {
      setPageNumber(results[0]);
    }
  };

  const extractTextFromPage = async (pageNum: number): Promise<string> => {
    const pdf = await pdfjsLib.getDocument(props.block.props.url).promise;
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    return textContent.items.map((item: any) => item.str).join(" ");
  };

  const goToNextSearchResult = () => {
    if (searchResults.length > 0) {
      const nextIndex = (currentSearchIndex + 1) % searchResults.length;
      setCurrentSearchIndex(nextIndex);
      setPageNumber(searchResults[nextIndex]);
    }
  };

  if (!workerLoaded) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-800">
        PDFを準備しています....。
      </div>
    );
  }

  return (
    <div className="pdf-container" ref={pdfRef}>
      <div className="pdf-viewer-container flex">
        {/* 🔹 サイドプレビュー (全ページのサムネイル) */}
        {showSidebar && (
          <div className="pdf-sidebar ">
            {numPages &&
              Array.from({ length: numPages }, (_, index) => (
                <div
                  key={index}
                  className={`pdf-thumbnail ${
                    pageNumber === index + 1
                      ? "active border border-blue-500"
                      : ""
                  }`}
                  onClick={() => goToPage(index + 1)}
                >
                  <Document file={props.block.props.url}>
                    <Page pageNumber={index + 1} width={80} />
                  </Document>
                </div>
              ))}
          </div>
        )}

        {/* 🔹 メインPDFビュー */}
        <div className="pdf-main-view">
          <div className=" flex gap-2">
            <div className="flex gap-2 items-center gap-2\">
              <input
                type="text"
                value={searchText}
                onChange={handleSearchChange}
                placeholder="検索..."
                className="p-1 rounded-lg text-gray-800"
              />
              <button
                onClick={performSearch}
                className="px-3 py-1 rounded-lg bg-white text-gray-800 shadow-md hover:bg-gray-200 transition-all"
              >
                🔍 検索
              </button>
              <button
                onClick={goToNextSearchResult}
                className="px-3 py-1 rounded-lg bg-white text-gray-800 shadow-md hover:bg-gray-200 transition-all"
              >
                ⏭ 次へ
              </button>
            </div>
          </div>

          <div className="pdf-controls flex relative">
            <div className=" flex gap-4 absolute left-0 ml-4">
              <div
                onClick={toggleSidebar}
                className=" transition-all flex gap-2"
              >
                <RiSideBarLine className=" w-6 h-6" />
              </div>
            </div>

            <button
              className="ml-4"
              onClick={goToPrevPage}
              disabled={pageNumber === 1}
            >
              <AiOutlineLeft size={20} />
            </button>
            <input
              type="number"
              value={pageNumber}
              onChange={handlePageInput}
              min="1"
              max={numPages}
              className="pdf-page-input"
            />
            <span>/ {numPages}</span>
            <button
              className="ml-4"
              onClick={goToNextPage}
              disabled={pageNumber === numPages}
            >
              <AiOutlineRight size={20} />
            </button>
            <button className="ml-4" onClick={zoomOut} disabled={scale <= 0.5}>
              <BsZoomOut size={20} />
            </button>
            <span>{(scale * 100).toFixed(0)}%</span>
            <button onClick={zoomIn} disabled={scale >= 3}>
              <BsZoomIn size={20} />
            </button>
            <button onClick={toggleFullScreen}>
              <BsArrowsFullscreen size={20} />
            </button>
            <button onClick={downloadPDF}>
              <BsDownload size={20} />
            </button>
          </div>
          <Document
            file={props.block.props.url}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={true} // これを true にする
              renderAnnotationLayer={true}
              customTextRenderer={textRenderer}
              onLoadSuccess={() => setIsPageLoading(false)}
            />
            <Outline onItemClick={onItemClick} />
          </Document>
        </div>
      </div>
    </div>
  );
};

export const PDF = createReactBlockSpec(
  {
    type: "pdf",
    propSchema: {
      name: {
        default: "" as const,
      },
      url: {
        default: "" as const,
      },
      caption: {
        default: "" as const,
      },
      showPreview: {
        default: true,
      },
      previewWidth: {
        default: 780,
      },
    },
    content: "none",
    isFileBlock: true,
  },
  {
    render: (props) => (
      <ResizableFileBlockWrapper
        {...(props as any)}
        bbuttonText={"Add PDF"}
        buttonIcon={<RiFilePdfFill size={24} />}
      >
        <PDFPreview {...(props as any)} />
      </ResizableFileBlockWrapper>
    ),
  }
);

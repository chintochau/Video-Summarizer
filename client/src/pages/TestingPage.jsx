import {
  EditorContent,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Markdown from "markdown-to-jsx";
import React, { useState } from "react";
import { Separator } from "../components/ui/separator";
import { Markdown as MarkdownExtension } from "tiptap-markdown";

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 }) ? "is-active" : ""
          }
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className={editor.isActive("highlight") ? "is-active" : ""}
        >
          Highlight
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
        >
          Left
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" }) ? "is-active" : ""
          }
        >
          Center
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
        >
          Right
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className={
            editor.isActive({ textAlign: "justify" }) ? "is-active" : ""
          }
        >
          Justify
        </button>
      </div>
    </div>
  );
};

const extensions = [
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
    },
    orderedList: {
      keepMarks: true,
    },
  }),
  MarkdownExtension,
];

const content = `
### Introduction
這段影片由安築主持，主要探討特斯拉的最新動態，包括4680號電池的計畫可能被放棄、特斯拉推出高CP值的新車款，以及馬斯克在政治上的新立場。影片提供了關於特斯拉未來發展的深入分析，並引發了觀眾對於電動車市場的關注。

### Main Body
#### perspective - 4680號電池計畫的未來
- 根據影片的內容（00:01:00），特斯拉的4680號電池計畫面臨困境，馬斯克可能會在年底前放棄這項計畫，因為目前的生產效率和成本無法達到預期。
- 雖然4680號電池曾被寄予厚望，預計能提高能量密度和降低生產成本，但實際上卻未能顯著提升車輛的續航力或性能（00:02:10）。

#### perspective - 付費解鎖續航力功能
- 影片提到（00:04:10），特斯拉推出了付費解鎖續航力的選項，讓車主可以透過額外支付來增加車輛的續航力。這種做法引發了觀眾的討論和不同的看法。
- 安築認為，這種付費解鎖的模式在業界並不罕見，且只要交車時的規格符合預期，後續的付費選項是可接受的（00:05:14）。

#### perspective - 超充站的未來
- 影片中提到（00:06:00），特斯拉的超充站建設速度減緩，這可能會影響到未來的充電體驗。儘管如此，越來越多的其他品牌車輛開始支持特斯拉的充電規格，這將促進電動車的普及（00:06:32）。
- 安築對於特斯拉的超充站是否能夠持續擴展感到擔憂，但也認為這對於其他品牌的消費者而言是一個利好消息（00:07:00）。

#### perspective - 新款Model 3的推出
- 影片中介紹了新款Model 3的長程後輪驅動版，這款車的續航力顯著提升，且價格相對於標準版更具吸引力（00:07:50）。
- 安築建議有意購買的消費者應該儘快行動，以免錯過7500美元的退稅優惠（00:08:49）。

#### perspective - 馬斯克與政治的關聯
- 最後，影片提到馬斯克對於川普的支持及其可能對特斯拉的影響（00:09:58）。馬斯克的政治立場引發了觀眾的關注，尤其是對於支持民主黨的消費者。
- 安築認為，馬斯克的政治表態可能會影響消費者的購車決策，尤其是對於那些對民主黨有強烈支持的消費者來說（00:12:04）。

### Conclusion
影片深入探討了特斯拉的多項重要消息，包括4680號電池的未來、付費解鎖功能的推出、新款Model 3的上市以及馬斯克在政治上的立場。這些因素都可能影響特斯拉的市場表現和消費者的購買決策。

### call to action from author
安築鼓勵觀眾關注特斯拉的最新動態，並在考慮購買電動車時，特別注意即將到來的退稅優惠和市場變化。他也感謝觀眾的支持，期待在下次影片中與大家分享更多有趣的話題。
`;

export default () => {
  const [textContent, setTextContent] = useState(content);

  const editor = useEditor({
    extensions: extensions,
    content: textContent,
    onUpdate: ({ editor }) => {
      const newContent = editor.storage.markdown.getMarkdown();
      setTextContent(newContent);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert ",
      },
    },
  });

  return (
    <>
      <MenuBar editor={editor} />
      <div className="flex">
        <EditorContent editor={editor} />

        <Markdown className="prose prose-sm sm:prose lg:prose-lg dark:prose-invert ">
          {textContent}
        </Markdown>
      </div>
      <Separator className="my-2" />
      <div>{textContent}</div>
      <Separator className="my-2" />
    </>
  );
};

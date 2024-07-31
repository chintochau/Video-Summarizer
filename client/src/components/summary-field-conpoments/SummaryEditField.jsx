import React from "react";
import { Markdown as MarkdownExtension } from "tiptap-markdown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "../ui/button";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SummaryService from "../../services/SummaryService";
import { useSummaryContext } from "../../contexts/SummaryContext";

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

const MenuBar = ({ editor, setIsEditing, isEditing,summaryId }) => {
  if (!editor) {
    return null;
  }

  const {setSummaries,summaries} = useSummaryContext();


  const updateSummary = async () => {
    if (editor) {
      const summary = editor.storage.markdown.getMarkdown();
      const response = await SummaryService.updateSummary({
        summary,
        summaryId,
      });

      if (response) {
        setSummaries((prev) =>
          prev.map((summaryObject) =>
            summaryObject._id === summaryId
              ? { ...summaryObject, summary: summary }
              : summary
          )
        );
        setIsEditing(false);
      }

    }
  };


  return (
    <div className=" p-1 w-1/2 fixed space-x-1 z-10  flex items-center  bg-white">
      <Button
        variant="ghost"
        onClick={() => {
          editor.chain().focus().toggleHeading({ level: 1 }).run();
        }}
        className={
          editor.isActive("heading", { level: 1 })
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        H1
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={
          editor.isActive("heading", { level: 2 })
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        H2
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 3 })
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        H3
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={
          editor.isActive("heading", { level: 4 })
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        H4
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={
          editor.isActive("paragraph")
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        Paragraph
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={
          editor.isActive("bold")
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        Bold
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={
          editor.isActive("italic")
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        Italic
      </Button>
      <Button
        variant="ghost"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={
          editor.isActive("strike")
            ? "text-cyan-500  outline-cyan-500 outline outline-1"
            : ""
        }
      >
        Strike
      </Button>
      <Button
        alt="Cancel"
        variant="ghost"
        className="p-2 text-red-400 border-red-500 opacity-100 hover:opacity-80 outline-1 outline hover:text-red-500"
        onClick={() => {
          setIsEditing(!isEditing);
        }}
      >
        <XMarkIcon className="w-6 h-6" />
      </Button>
      <Button
        alt="Save"
        variant="ghost"
        className="p-2 text-blue-400 border-blue-500 opacity-100 hover:opacity-80 outline outline-1 hover:text-blue-500"
        onClick={() => {
          setIsEditing(!isEditing);
          updateSummary();
        }}
      >
        <CheckIcon className="w-6 h-6" />
      </Button>
    </div>
  );
};

const SummaryEditField = (params) => {
  const { summary, summaryId, setIsEditing, isEditing } = params;

  const editor = useEditor({
    extensions: extensions,
    content: summary,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg dark:prose-invert md:max-w-full p-4 focus:outline-none mt-10",
      },
    },
  });

  return (
    <>
      <MenuBar
        editor={editor}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
        summaryId={summaryId}
      />
      <EditorContent editor={editor} />
    </>
  );
};

export default SummaryEditField;

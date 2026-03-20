"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { updateCopy } from "@/app/[locale]/(pages)/admin/content-management/handle-save";
import type { CopyId } from "@/generated/copy-ids";
import { useLocale } from "../i18n/locale-context";
import { useSession } from "next-auth/react";

export function EditableText({ text, cid }: { text: string; cid: CopyId }) {
  const [isOpen, setIsOpen] = useState(false);

  const showEditModal = (e: React.MouseEvent<HTMLSpanElement>) => {
    if (!e.altKey) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(true);
  };

  const locale = useLocale();

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;

    const data = new FormData(form);
    const copy = data.get("copy") as string;

    await updateCopy(cid, locale, copy);
    setIsOpen(false);
  };

  function preventInsideTriggeringOutside(
    e: React.MouseEvent<HTMLFormElement>,
  ) {
    e.stopPropagation();
    if (!e.currentTarget.contains(e.target as Node)) {
      e.preventDefault();
    }
  }
  return (
    <>
      {/** biome-ignore lint/a11y/noStaticElementInteractions: This is only for admins so screwwww accessbility  */}
      {/** biome-ignore lint/a11y/useKeyWithClickEvents: This is only for admins so screwwww accessbility */}
      <span className="editable-text__admin" onClick={showEditModal}>{text}</span>
      {isOpen &&
        createPortal(
          <div className="flex flex-col gap-1 fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md border-2 border-gray-800 bg-black p-2 text-sm">
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: THere is no othere way */}
            <form
              onSubmit={handleSave}
              className="flex flex-col gap-1"
              onClick={preventInsideTriggeringOutside}
            >
              <textarea
                className="w-full rounded-md border-2 border-gray-900 p-2 text-sm min-w-100 focus:outline-blue-800 focus:outline"
                defaultValue={text}
                name="copy"
              />
              <button
                type="submit"
                className="rounded-md bg-blue-500 px-2 py-1 text-white focus:outline focus:outline-blue-800"
              >
                Save
              </button>
            </form>
          </div>,
          document.body,
        )}
    </>
  );
}

export function useEditableTextHints(){
	const {data:session}  = useSession()
	const isAdmin = session?.user?.roles?.includes("admin")
	useEffect(()=>{
		if(!isAdmin) return
		console.log("useEditableTextHints")
		const showHints = (e)=>e.altKey && document.querySelector("body")?.classList.add("show-editable-text")
		const hideHints = (e)=>document.querySelector("body")?.classList.remove("show-editable-text")
		document.addEventListener("keydown", showHints)
		document.addEventListener("keyup", hideHints)

		return ()=>{
			document.removeEventListener("keydown", showHints)
			document.removeEventListener("keyup", hideHints)
		}
	}, [isAdmin])
}

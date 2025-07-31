import { useState } from "react";

export function useTagsManager(form) {
  const [currentTag, setCurrentTag] = useState("");
  const tags = form.watch("tags");

  function addTag() {
    if (!currentTag.trim()) return;
    if (tags.includes(currentTag.trim())) {
      setCurrentTag(""); // Clear input
      return;
    }

    const updatedTags = [...tags, currentTag.trim()];
    form.setValue("tags", updatedTags);

    setCurrentTag("");
  }

  function removeTag(indexToRemove) {
    const updatedTags = tags.filter((_, index) => index !== indexToRemove);
    form.setValue("tags", updatedTags);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  }

  return { tags, currentTag, setCurrentTag, addTag, removeTag, handleKeyPress };
}

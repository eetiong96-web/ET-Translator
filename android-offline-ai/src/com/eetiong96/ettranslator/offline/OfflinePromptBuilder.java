package com.eetiong96.ettranslator.offline;

public final class OfflinePromptBuilder {
    private OfflinePromptBuilder() {
    }

    public static String build(String text, String direction, String tone) {
        return "You are ET Business Translator running offline on Android with Qwen. "
            + "Translate between English and Simplified Chinese for a product manager working in a Mainland Chinese company. "
            + "Use natural Mainland business Chinese. Preserve code identifiers, product names, acronyms, numbers, links, and formatting. "
            + "Return only compact JSON with keys translation, pinyin, meaning, terms. "
            + "terms must contain at most 3 objects with source, translation, pinyin, meaning. "
            + "Do not return alternatives. Use Simplified Chinese only.\n\n"
            + "Direction: " + direction + "\n"
            + "Tone: " + tone + "\n"
            + "Text:\n" + text;
    }
}

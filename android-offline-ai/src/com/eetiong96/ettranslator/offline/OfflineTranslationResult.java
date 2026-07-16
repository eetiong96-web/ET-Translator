package com.eetiong96.ettranslator.offline;

public final class OfflineTranslationResult {
    public final String translation;
    public final String pinyin;
    public final String meaning;
    public final String terms;
    public final String error;

    public OfflineTranslationResult(String translation, String pinyin, String meaning, String terms, String error) {
        this.translation = valueOrEmpty(translation);
        this.pinyin = valueOrEmpty(pinyin);
        this.meaning = valueOrEmpty(meaning);
        this.terms = valueOrEmpty(terms);
        this.error = valueOrEmpty(error);
    }

    public boolean hasError() {
        return !error.isEmpty();
    }

    private static String valueOrEmpty(String value) {
        return value == null ? "" : value;
    }
}

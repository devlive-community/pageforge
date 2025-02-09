class BaseProcessor {
    constructor(config, pages) {
        this.config = config;
        this.pages = pages;
    }

    isFeatureEnabled(featureName) {
        return this.config.feature?.[featureName]?.enable === true;
    }
}
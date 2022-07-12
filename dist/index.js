"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load = exports.FooterOverrideTheme = exports.FooterOverrideThemeContext = exports.LoggingTheme = void 0;
const typedoc_1 = require("typedoc");
/**
 * A clone of the default theme, which prints a message when rendering each page.
 */
class LoggingTheme extends typedoc_1.DefaultTheme {
    render(page) {
        this.application.logger.info(`Rendering ${page.url}`);
        return super.render(page);
    }
}
exports.LoggingTheme = LoggingTheme;
/**
 * The theme context is where all of the partials live for rendering a theme,
 * in addition to some helper functions.
 */
class FooterOverrideThemeContext extends typedoc_1.DefaultThemeRenderContext {
    constructor(theme, options) {
        super(theme, options);
        const oldFooter = this.footer;
        // Overridden methods must have `this` bound if they intend to use it.
        // <JSX.Raw /> may be used to inject HTML directly.
        this.footer = () => {
            return (typedoc_1.JSX.createElement(typedoc_1.JSX.Fragment, null,
                oldFooter(),
                typedoc_1.JSX.createElement("div", { class: "container" },
                    typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: this.markdown("Custom footer text, with **markdown** support!") }))));
        };
    }
}
exports.FooterOverrideThemeContext = FooterOverrideThemeContext;
/**
 * A near clone of the default theme, that adds some custom text after the footer.
 */
class FooterOverrideTheme extends typedoc_1.DefaultTheme {
    getRenderContext() {
        this._contextCache || (this._contextCache = new FooterOverrideThemeContext(this, this.application.options));
        return this._contextCache;
    }
}
exports.FooterOverrideTheme = FooterOverrideTheme;
/**
 * Called by TypeDoc when loading this theme as a plugin. Should be used to define themes which
 * can be selected by the user.
 */
function load(app) {
    // Hooks can be used to inject some HTML without fully overwriting the theme.
    app.renderer.hooks.on("body.begin", (_) => (typedoc_1.JSX.createElement("script", null,
        typedoc_1.JSX.createElement(typedoc_1.JSX.Raw, { html: "console.log(`Loaded ${location.href}`)" }))));
    // Or you can define a custom theme. This one behaves exactly like the default theme,
    // but logs a message when rendering a page.
    app.renderer.defineTheme("logging", LoggingTheme);
    // While this one overwrites the footer to include custom content.
    app.renderer.defineTheme("footer", FooterOverrideTheme);
}
exports.load = load;

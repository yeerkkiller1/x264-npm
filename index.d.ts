declare module "x264-npm" {
    /** args are passed directly to the x264 executable, and text from stdout is returned in a promise (anything on stderr causes an error to be thrown, with the text on stderr). */
    function x264(...args: string[]): Promise<string>;
    export = x264;
}
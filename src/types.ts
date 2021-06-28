export type Options = {

  /**
   * The location of the assets on the filesystem
   */
  staticDir: string;

  /**
   * By default the public URL will be prefixed with the basename of the staticDir
   * options. Use this setting to override this
   */
  pathPrefix?: string;

  /**
   * If specified, all assets will be get a Cache-Control: max-age=n header
   */
  maxAge?: number;
}

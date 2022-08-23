
/* eslint no-console: "off" */


class Tracer {
  private static DEBUG_COLOR = '#999999';

  private static LOG_COLOR = '#000000';

  private static INFO_COLOR = '#6DAB0A';

  private static WARN_COLOR = '#FF880B';

  private static ERROR_COLOR = '#FF2221';

  private static FATAL_COLOR = '#D40776';

  // 非生产环境下开启debug日志
  static debugMode = false;
  // static debugMode = (EnvConfig.envType != EnvTypeEnum.PROD);

  /**
   * 禁止输出Debug级以下的日志
   */
  static forbidDebugLog: boolean = !Tracer.debugMode;

  /**
   * 输出日志
   */
  public static log(...args: any[]): void {
    if (Tracer.forbidDebugLog) return;

    if (console != null) Tracer.consoleOut(console.log, args, null, Tracer.LOG_COLOR);

    //        writeToMonsterCh("", LOG_COLOR, args);
  }

  private static consoleOut(
    consoleFn: Function,
    infos: any[],
    channel: any,
    color: string = '#000000',
    fontSize: string = '1em',
  ) {
    if (infos == null || consoleFn == null) return;

    const formatCss = `color:${color};font-size:${fontSize}`;
    let baseStr: string;
    if (channel) {
      baseStr = '%c[%s]%s';
      // baseStr += StringHelper.repeat('%s', infos.length - 1);
      infos = [baseStr, formatCss, channel].concat(infos);
    } else {
      baseStr = '%c%s';
      // baseStr += StringHelper.repeat('%s', infos.length - 1);
      infos = [baseStr, formatCss].concat(infos);
    }

    consoleFn.apply(console, infos);
  }

  /**
   * 输出日志
   */
  public static debug(...args: any[]): void {
    if (Tracer.forbidDebugLog) return;

    if (console != null) Tracer.consoleOut(console.debug, args, null, Tracer.DEBUG_COLOR);
  }

  /**
   * 输出日志
   */
  public static logch(channel: any, ...args: any[]): void {
    if (Tracer.forbidDebugLog) return;

    if (console != null) Tracer.consoleOut(console.log, args, channel, Tracer.LOG_COLOR);
  }

  /**
   * 输出日志
   */
  public static debugch(channel: any, ...args: any[]): void {
    if (Tracer.forbidDebugLog) return;

    if (console != null) Tracer.consoleOut(console.debug, args, channel, Tracer.DEBUG_COLOR);
  }

  //    private static writeToMonsterCh(channel: any, color: number, args: any[]): void {
  //        if (!monsterDebuggerOn || !MonsterDebugger)//By Seamoon
  //        {
  //            return;
  //        }
  //        var caller: any = null;
  //        var obj: any = null;
  //        if (args.length >= 2) {
  //            //第一个参数是caller，后面的均是要记录的日志
  //            caller = args.shift();
  //            obj = args;
  //        }
  //        if (args.length == 1) {
  //            obj = args[0];
  //        }
  //        MonsterDebugger.console.log(caller, obj, "", channel, color);
  //    }

  /**
   * 输出日志
   */
  public static info(...args: any[]): void {
    if (Tracer.forbidDebugLog) return;

    if (console != null) Tracer.consoleOut(console.info, args, null, Tracer.INFO_COLOR);
  }

  /**
   * 输出日志
   */
  public static infoch(channel: any, ...args: any[]): void {
    // if (Tracer.forbidDebugLog) return;

    if (console != null) Tracer.consoleOut(console.info, args, channel, Tracer.INFO_COLOR);
  }

  /**
   * 输出日志
   */
  public static warn(...args: any[]): void {

    if (console != null) Tracer.consoleOut(console.warn, args, null, Tracer.WARN_COLOR);
  }

  /**
   * 输出日志
   */
  public static error(...args: any[]): void {

    if (console != null) Tracer.consoleOut(console.error, args, null, Tracer.ERROR_COLOR);
  }

  /**
   * 输出日志
   */
  public static fatal(...args: any[]): void {

    if (console != null) Tracer.consoleOut(console.error, args, null, Tracer.FATAL_COLOR, '2em');
  }

  /**
   * 输出日志
   */
  public static warnch(channel: any, ...args: any[]): void {

    if (console != null) Tracer.consoleOut(console.warn, args, channel, Tracer.WARN_COLOR);
  }

  /**
   * 输出日志
   */
  public static errorch(channel: any, ...args: any[]): void {
    if (console != null) {
      Tracer.consoleOut(console.error, args, channel, Tracer.ERROR_COLOR, '1.5em');
    }
  }

  /**
   * 输出日志
   */
  public static fatalch(channel: any, ...args: any[]): void {

    if (console != null) Tracer.consoleOut(console.error, args, channel, Tracer.FATAL_COLOR, '2em');
  }

  /**
   * 获得函数的名称，调试用。
   * @param func
   * @return
   */
  public static getFunctionName(func: Function): string {
    // Match:
    // - ^          the beginning of the string
    // - function   the word 'function'
    // - \s+        at least some white space
    // - ([\w\$]+)  capture one or more valid JavaScript identifier characters
    // - \s*        optionally followed by white space (in theory there won't be any here,
    //              so if performance is an issue this can be omitted[1]
    // - \(         followed by an opening brace
    //
    const result = /^function\s+([\w\$]+)\s*\(/.exec(func.toString());
    return result ? result[1] : '<anonymous function>'; // for an anonymous function there won't be a match
  }

  //    /**
  //     * 获取所有日志的细节
  //     * @return
  //     *
  //     */
  //    public static getAllLogDetail(): LogDetail {
  //        var logDetail: LogDetail = new LogDetail();
  //        logDetail.allLog = Cc.getAllLog();
  //        logDetail.fatalLog = Cc.getLogByChannel("!Fatal");
  //        logDetail.fatalLogCount = Cc.getLogCount("!Fatal");
  //        logDetail.errorLog = Cc.getLogByChannel("!Error");
  //        logDetail.errorLogCount = Cc.getLogCount("!Error");
  //        logDetail.warnLogCount = Cc.getLogCount("!Warn");
  //
  //        //			SpeedTester.testMethod(function():void{
  //        //
  //        //			},1,"获得日志的时间");
  //
  //
  //        return logDetail;
  //    }
}
export default Tracer;

# App Template

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.1.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## 
- ダミーデータ
  https://hogehoge.tk/personal/generator/
  を使用させて頂いています。

- ダッシュボード画面
  - 作業中
- グリッド画面
  - ビルトイン機能で実現している部分
    - Excelスタイルフィルター
    - 列ソート
    - グルーピング
    - 一括編集
    - 列リサイズ
    - 列移動
    - 列固定
    - 行選択
    - グローバル検索
    - データエクスポート(Excel, CSV)
    - コピー
      - ctrl+cでグリッドデータコピー -> ctrl+vでExcel貼り付け

  - カスタム実装している部分
    - データエクスポート(Excel, CSV)
      - 選択行のみのエクスポートが可能
    - データインポート(Excel, CSV)
    - ペースト
      - ctrl+cでExcelデータコピー -> ctrl+vでグリッド貼り付け
    -	一括編集
      - ctrl+zでUndo
      - ctrl+yでRedo
    - 行選択
      - Shift+clickで範囲選択
    - 列定義の変更
      - ヘッダー名
      - データタイプ(現状上手く変換できていない)
- フォーム画面
  - 作業中

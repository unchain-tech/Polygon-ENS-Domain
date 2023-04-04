## 💬 Polygon-ENS-Domain(prototype)

本レポジトリは Polygon-ENS-Domain の完成版を示したものになります。

以下の手順を実行することで Polygon-ENS-Domain の挙動を確認できます。

### レポジトリのクローン

[こちら](https://github.com/unchain-tech/Polygon-ENS-Domain.git)から Polygon-ENS-Domain をクローンします。

その後、下のコマンドを実行することでパッケージをインストールしていきます。

```
yarn
```

### コントラクトのデプロイ

まずは`packages/contractディレクトリ`に`.env`ファイルを作成して、下の変数名を宣言しそれぞれウォレットアドレスと Alchemy の HTTP-KEY を代入しましょう。([]は必要ありません)

```
PRIVATE_KEY=[ウォレットアドレス]
STAGING_ALCHEMY_KEY=[AlchemyのHTTP-KEY]
```

次に下のコマンドを実行することでコントラクトをデプロイしましょう。

```
yarn contract deploy
```

最後にデプロイしたコントラクトのアドレスをどこかへコピー&ペーストしておきましょう。後ほど使用します。

### フロントエンドの準備・起動

まずは先ほどコピーしたコントラクトアドレスを App.js の 15 行目あたりにある`CONTRACT_ADDRESS`という変数に文字列として代入しましょう。

次に`packages/client/utils/contractABI.json`の内容を`packages/contract/artifacts/contracts/Domains.sol/Domains.json`の内容に置き換えましょう。

これでフロントエンドを起動する準備は整いました。下のコマンドを実行することでフロントエンドを起動しましょう。

```
yarn client start
```

[こちら](https://app.unchain.tech/learn/Polygon-ENS-Domain/ja/4/2/)の section4-lesson2 を参考にしながらフロントエンドの動作確認をしてみましょう！

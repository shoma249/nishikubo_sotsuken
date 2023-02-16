# nishikubo_sotsuken
## 目的
- 未経験のプログラミング言語学習支援
- 他者が理解しやすいコードの作成スキル向上

# セットアップマニュアル
## セットアップ方法
1. Node.js(https://nodejs.org/ja/download/releases/)をインストール
2. コマンドプロンプト上で，npmコマンドを使い，path，body-parser，express，http，socket.io，fs，ip，mysqlをインストール
3.  本リポジトリをローカルPC上にクローン
4.  mysql(https://dev.mysql.com/downloads/windows/installer/5.7.html)をインストール
5.  環境変数のパスを編集し，"C:\Program Files\MySQL\MySQL Server 5.7\bin\"に書き換えて適用させる
6.  コマンドプロンプトから"net start mysql57"を入力し，mysqlが起動できるか確認する
7.  起動できれば，mysql --user=root --password"を入力し，パスワードをmysqlをインストールする際に設定したパスワードを入力しログインする．
8.  questionsデータベースを作成し，questionテーブル，testcaseテーブル，answerテーブルを作成する
9.  
10.  assetデータにある，データを各テーブルに格納する



# 運用マニュアル
## アプリ起動方法
1. コマンドプロンプトを起動させ，"net start mysql57"を入力し，mysqlデータベースをスタートさせる
2. node.jsを起動させ，"npm start"を入力するとURLが表示されるので，そのURLにブラウザでアクセスすることでwebアプリを使用できる

## アプリ不具合
- ユーザがブラウザをリロードするとサーバが強制的に落ちることがある
- ゲーム中に他のユーザがアプリにアクセスする，ゲーム終了後にサーバを再起動させずにアプリにアクセスしようとすると強制的にサーバが落ちるため，ゲームは一回ごとにサーバを再起動させないといけない

## アプリ終了方法
1. node.js上でCtrl+Cを押すと終了するか質問されるので，yまたはyesと入力すると終了できる

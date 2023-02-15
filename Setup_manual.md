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

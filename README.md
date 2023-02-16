# nishikubo_sotsuken
## 概要
課題に対するコード実装をベースとした複数人で使用するプログラミング学習ツールです
未経験のプログラミング言語学習支援，他者が理解しやすいコードの作成スキル向上を目的としています．
***
## セットアップマニュアル
1. Node.js(https://nodejs.org/ja/download/releases/ )をインストールしてください
2. コマンドプロンプト上で，npmコマンドを使い，path，body-parser，express，http，socket.io，fs，ip，mysqlをインストールしてください
   (例: `npm install path` )
3.  本リポジトリをローカルPCの任意の場所にクローンしてください
4.  mysql(https://dev.mysql.com/downloads/windows/installer/5.7.html )をインストールしてください
5.  環境変数のパスを編集し，"C:\Program Files\MySQL\MySQL Server 5.7\bin\"に書き換えてOKボタンをクリックしてください
6.  コマンドプロンプトから"net start mysql57"を入力し，mysqlが起動できるか確認してください
7.  起動できれば，mysql --user=root --password"を入力し，パスワードをmysqlをインストールする際に設定したパスワードを入力しログインしてください
8.  questionsデータベースを作成し，questionテーブル，testcaseテーブル，answerテーブルを作成してください
9.  
10.  assetデータにある，データを各テーブルに格納してください
***
## 運用マニュアル
### アプリ起動方法
1. コマンドプロンプトを管理者として実行し，`net start mysql57`を入力し，mysqlデータベースをスタートさせてください<img width="433" alt="DB起動" src="https://user-images.githubusercontent.com/89173987/219278660-66e503ae-fddb-4927-b109-adaac2f85ffb.png">
2. コマンドプロンプトを起動させ，本リポジトリをクローンした任意の場所に移動し，リポジトリ内のappフォルダに移動した上で`npm start`コマンドを入力してください
3. コマンドを入力するとURLが表示されるので，そのURLにブラウザでアクセスすることでwebアプリを使用できます
![Inkedサーバ起動_LI](https://user-images.githubusercontent.com/89173987/219281867-7be89541-77b2-4216-91c6-0f27981fd6ac.jpg)

### アプリ不具合
- ユーザがブラウザをリロードするとサーバが強制的に落ちることがある
- ゲーム中に他のユーザがアプリにアクセスする，ゲーム終了後にサーバを再起動させずにアプリにアクセスしようとすると強制的にサーバが落ちるため，ゲームは一回ごとにサーバを再起動させないといけない

### アプリ終了方法
- node.js上でCtrl+Cを押すと終了するか質問されるので，yまたはyesと入力するとサーバを終了できます![Inkedサーバ終了_LI](https://user-images.githubusercontent.com/89173987/219282181-0595011b-e229-4a71-ac34-b5d0091dcdc4.jpg)
***
## ユーザマニュアル(アプリの使用方法)
1. アプリにアクセスし，名前を入力して参加ボタンをクリックしてください![start](https://user-images.githubusercontent.com/89173987/219273760-90d27a65-25db-40ae-a78c-8d7a7e172e4b.jpg)
2. 右下の言語選択メニューで使用する言語を選択してください![Inkedselectmenu_LI](https://user-images.githubusercontent.com/89173987/219273897-dca6758e-29b0-49c2-bdee-ec90633abf63.jpg)
3. 参加するメンバーが全員アクセスしたことを確認し，代表者がスタートボタンをクリックするとゲームが開始されます![Inkedbefore_start_LI](https://user-images.githubusercontent.com/89173987/219274096-fbd3de96-e1f8-4f5a-a418-5681dda26478.jpg)
4. 課題に対してエディタ上にコードを実装してください![Inkedgame_LI](https://user-images.githubusercontent.com/89173987/219274529-5f14d40e-78b1-4931-8225-4788ec39a5c7.jpg)
5. コードが課題の要求を満たしているかどうか右下のRUNボタンで実行して確かめながら実装を行ってください![Inkedrun_LI](https://user-images.githubusercontent.com/89173987/219274647-8a71b73d-bd03-46e7-bf78-5d6331c6c106.jpg)
6. コードが課題の要求を満たしていると思ったら右下のSUBMITボタンで提出してください![Inkedrun_LI](https://user-images.githubusercontent.com/89173987/219275551-4a0d9737-1d80-4598-a5e1-22a7c3ae0bee.jpg)
   - 判定の結果がクリアであれば，新しい課題が表示され，コードがひな形に戻ります．その状態からまた新しい課題のコードを実装してください
   - 判定の結果がクリアでなければ，クリアしていないと通知が来るので，引き続き課題の要求を満たせるようにコードを実装してください
7. 全メンバーで課題を10問クリアする，又は制限時間の1時間が経つとゲーム終了となり，リザルト画面に遷移します<img width="960" alt="result" src="https://user-images.githubusercontent.com/89173987/219274895-79f7f94d-550b-44fd-97dc-905657fc0687.png">
8. リザルト画面では，過去にゲームをプレイしたチームとクリアした数をスコアとして競うランキングを表示しています
9. また，クリアしたものとゲームの最後に実装中だった課題とコードが閲覧・実行できるようになっています
***なお，ゲームスタートから10分ごと，又はメンバーの内の誰かが課題のコード実装を完了した1分後に実装中の課題とコードがユーザ間で強制交換が行われます***
***コード実装が完了すると，クリアした課題とコードが全メンバー間で共有され，閲覧できるようになっています***

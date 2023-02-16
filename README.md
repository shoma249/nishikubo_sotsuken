# nishikubo_sotsuken
## 概要
課題に対するコード実装をベースとした複数人で使用するプログラミング学習ツールです
未経験のプログラミング言語学習支援，他者が理解しやすいコードの作成スキル向上を目的としています．
***
## セットアップマニュアル
1. Node.js(https://nodejs.org/ja/download/releases/ )をインストールしてください
2. コマンドプロンプト上で，npmコマンドを使い，path，body-parser，express，http，socket.io，fs，ip，mysqlをインストールしてください(例: `npm install path` )

![Inkednpmインストール_LI](https://user-images.githubusercontent.com/89173987/219289371-08b1cbf9-824c-4ea7-b4d6-42ebe62c9278.jpg)

3. 本リポジトリをローカルPCの任意の場所にクローンしてください
<img width="960" alt="クローン" src="https://user-images.githubusercontent.com/89173987/219317828-4b991081-9323-4a76-aa5b-6601ff28b7e9.png">

4. MySQL(https://dev.mysql.com/downloads/windows/installer/5.7.html )をインストールしてください
5. PCアイコンを右クリックし，プロパティ⇒システムの詳細設定⇒環境変数に移動してください
<img width="233" alt="PC右クリック" src="https://user-images.githubusercontent.com/89173987/219287981-31726530-d396-406c-a959-d11a738f76c4.png">
<img width="591" alt="システムの詳細設定" src="https://user-images.githubusercontent.com/89173987/219288321-535148cd-f6fe-45ee-aa4a-66164154bf26.png">
<img width="339" alt="環境変数" src="https://user-images.githubusercontent.com/89173987/219288074-40c19bcc-5747-4f11-bed7-20798cc3360c.png">

6. 環境変数のパスを編集し，`C:\Program Files\MySQL\MySQL Server 5.7\bin\`を新規追加してOKボタンをクリックしてください

![Inkedpath_LI](https://user-images.githubusercontent.com/89173987/219291323-e08a6fd2-1c5e-4313-8d41-6d050de48833.jpg)
<img width="374" alt="path2" src="https://user-images.githubusercontent.com/89173987/219288983-c023d7a8-b096-4bed-bded-ede0206b057b.png">

7. コマンドプロンプトを管理者として実行し，`net start mysql57`を入力してmysql57を起動してください
<img width="584" alt="コマンドプロンプト" src="https://user-images.githubusercontent.com/89173987/219292679-96741ec6-8e6b-46be-adc8-116d75421b1d.png">
<img width="433" alt="DB起動" src="https://user-images.githubusercontent.com/89173987/219292753-dd079659-35e2-4120-94af-7eed7af9249f.png">

8. `mysql -u root -p`を入力し，mysqlをインストールする際に設定したパスワードを入力しログインしてください
<img width="492" alt="mysqlログイン" src="https://user-images.githubusercontent.com/89173987/219293225-d6d736e0-cf3c-4cc6-9c96-759da1fbb0de.png">

9. `create database questions;` を入力してquestionsデータベースを作成してください
<img width="224" alt="create_DB" src="https://user-images.githubusercontent.com/89173987/219294418-d79b443e-6a62-4cc3-8a7e-d3c9a1485020.png">

10. `create table question(id int primary key auto_increment not null, task mediumtext, testnum int);`を入力してquestionテーブルを作成してください
<img width="628" alt="create_question" src="https://user-images.githubusercontent.com/89173987/219295764-64584a51-cfd4-4b22-acd6-2f9d51daa1c9.png">

11. `create table testcase(id int primary key auto_increment not null, test1 mediumtext, test2 mediumtext, test3 mediumtext, test4 mediumtext, test5 mediumtext, test6 mediumtext, test7 mediumtext, test8 mediumtext);`を入力してtestcaseテーブルを作成してください
<img width="728" alt="create_textcase" src="https://user-images.githubusercontent.com/89173987/219297052-e62378e4-4369-453f-b9f7-ecf0304a2605.png">

12. `create table answer(id int primary key auto_increment not null, answer1 mediumtext, answer2 mediumtext, answer3 mediumtext, answer4 mediumtext, answer5 mediumtext, answer6 mediumtext, answer7 mediumtext, answer8 mediumtext);`を入力してanswerテーブルを作成してください
<img width="729" alt="create_answer" src="https://user-images.githubusercontent.com/89173987/219297745-7cb3bb79-a247-44c7-9d86-e2d6376d06e3.png">

13. assetデータにある，西窪卒研_questionsDBデータを各テーブルに格納してください(コマンド:`insert into テーブル名(カラム,カラム・・・) values(データ，データ・・・);`)
(例:`insert into question(task,testnum) values("長さ 19 の文字列 s を入力します。文字列 s の形式は [英小文字 (5) 文字],[英小文字 (7) 文字],[英小文字 (5) 文字] で表されます．カンマで区切られた文字列 s を、スペースで区切られた文字列に変換してください．入力例1: happy,newyear,enjoy 出力例1: happy newyear enjoy  入力例2: haiku,atcoder,tasks 出力例2: haiku atcoder tasks", 3);`)
<img width="805" alt="insert_question" src="https://user-images.githubusercontent.com/89173987/219312175-7e6011e4-fff6-4744-8feb-047265448b77.png">

14. `exit`を入力してmysqlからログアウトしてください
<img width="185" alt="exit" src="https://user-images.githubusercontent.com/89173987/219293832-ce16b8fa-1dd8-432e-81d0-061c8e064dfe.png">

15. app.jsを編集し，データベース接続処理部分のコードをmysqlインストールの際に設定したパスワードに変更してください
<img width="960" alt="code変更" src="https://user-images.githubusercontent.com/89173987/219299386-7f906d08-04e2-4cbd-b9b8-0ea4c185bbff.png">

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

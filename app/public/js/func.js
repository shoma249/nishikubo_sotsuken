var Pjs;

// processing言語用関数
function stop() { // not work
    if (Pjs)
        Pjs.exit();
}
function crun() {
    //console.log("Run");
    stop();
    var canvas = document.getElementById('canvas0');
    var code = editor.getValue(); //aceエディタに入力したコードを取得
    //console.log(code);
    try {
        Pjs = new Processing(canvas, code);
        //console.log(Pjs);
    } catch (e) {
        alert(e);
    }
}

// sleep関数
function sleep(a) {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}

// paiza.ioのapiを使用したコンパイル関数
const language = ["c", "cpp", "java", "python", "ruby", "php", "go", "javascript", "rust", "kotlin", "scala", "swift", "objective-c", "typescript"];

async function compile(code, lang, input) {
    var params = {
        source_code: code,
        language: language[lang],
        input: input,
        api_key: 'guest'
    };
    const query_params = new URLSearchParams(params);
    const options = {
        method: "post",
        body: query_params
    };

    const res_create = await fetch("http://api.paiza.io/runners/create", options);
    const res_create_json = await res_create.json();
    console.log(res_create_json.id);
    sleep(2000);

    url = "http://api.paiza.io/runners/get_details?id=" + res_create_json.id + "&api_key=guest";

    const res_get_details = await fetch(url);
    const res_get_details_json = await res_get_details.json();
    let result = '';
    if (res_get_details_json.build_result == 'success') {
        result = res_get_details_json.stdout;
    } else {
        result = res_get_details_json.build_stderr;
    }

    return result;
}

// ジャッジ関数
async function judge(code, lang, question) {
    let judge = 1;

    for (let i = 0; i < question.testNum; i++) {
        let result = await compile(code, lang, question.input[i]);
        if (result != question.answer[i]) {
            judge = 0;
            break;
        }
    }

    return judge;
}
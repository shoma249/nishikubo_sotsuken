var Pjs;

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

function sleep(a) {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}

/*
async function run() {
    const code = editor.getValue(); // エディタに書いたソースコード読み取り
    const input = document.getElementById("input").value;

    var params1 = {
        source_code: code,
        language: 'c',
        input: input,
        api_key: 'guest'
    };
    const query_params1 = new URLSearchParams(params1);
    const options1 = {
        method: "post",
        body: query_params1
    };

    const res_create = await fetch("http://api.paiza.io/runners/create", options1);
    const res_create_json = await res_create.json();
    console.log(res_create_json.id);
    sleep(2000);

    url = "http://api.paiza.io/runners/get_details?id=" + res_create_json.id + "&api_key=guest";

    const res_get_details = await fetch(url);
    const res_get_details_json = await res_get_details.json();
    if(res_get_details_json.build_result == 'success'){
        $('#output').text(res_get_details_json.stdout);
    }else{
        $('#output').text(res_get_details_json.build_stderr);
    }
    console.log(res_get_details_json.stdout);
}*/

async function compile(code, input) {
    var params1 = {
        source_code: code,
        language: 'c',
        input: input,
        api_key: 'guest'
    };
    const query_params1 = new URLSearchParams(params1);
    const options1 = {
        method: "post",
        body: query_params1
    };

    const res_create = await fetch("http://api.paiza.io/runners/create", options1);
    const res_create_json = await res_create.json();
    console.log(res_create_json.id);
    sleep(2000);

    url = "http://api.paiza.io/runners/get_details?id=" + res_create_json.id + "&api_key=guest";

    const res_get_details = await fetch(url);
    const res_get_details_json = await res_get_details.json();
    if(res_get_details_json.build_result == 'success'){
        $('#output').text(res_get_details_json.stdout);
    }else{
        $('#output').text(res_get_details_json.build_stderr);
    }
}
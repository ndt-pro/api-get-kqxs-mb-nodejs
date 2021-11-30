const express = require("express");
const app = express();
const request = require("request-promise");
const cheerio = require("cheerio");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(80);

const getKqxs = async (day, month, year) => {
    try {
        var $ = await request({
            uri: `https://xoso.com.vn/xsmb-${day}-${month}-${year}.html`,
            transform: function (body) {
                return cheerio.load(body);
            },
        });
    } catch (error) {
        return error;
    }

    let cnt_kqmb = $(`#kqngay_${day}${month}${year}_kq`);

    if(!cnt_kqmb.html()) {
        return {
            success: false,
            message: "Chưa có kết quả"
        };
    }

    let tb_kqmb = cnt_kqmb.find('table.table-result');

    if(Number.isNaN(parseInt(tb_kqmb.find('#mb_prizeDB_item0').text().trim())) || Number.isNaN(parseInt(tb_kqmb.find('#mb_prize7_item3').text().trim()))) {
        return {
            success: false,
            message: "Chưa có kết quả"
        };
    }

    let kq = {
        g_DB: tb_kqmb.find('#mb_prizeDB_item0').text().trim(),
        g_1: tb_kqmb.find('#mb_prize1_item0').text().trim(),
        g_2: [
            tb_kqmb.find('#mb_prize2_item0').text().trim(),
            tb_kqmb.find('#mb_prize2_item1').text().trim(),
        ],
        g_3: [
            tb_kqmb.find('#mb_prize3_item0').text().trim(),
            tb_kqmb.find('#mb_prize3_item1').text().trim(),
            tb_kqmb.find('#mb_prize3_item2').text().trim(),
            tb_kqmb.find('#mb_prize3_item3').text().trim(),
            tb_kqmb.find('#mb_prize3_item4').text().trim(),
            tb_kqmb.find('#mb_prize3_item5').text().trim(),
        ],
        g_4: [
            tb_kqmb.find('#mb_prize4_item0').text().trim(),
            tb_kqmb.find('#mb_prize4_item1').text().trim(),
            tb_kqmb.find('#mb_prize4_item2').text().trim(),
            tb_kqmb.find('#mb_prize4_item3').text().trim(),
        ],
        g_5: [
            tb_kqmb.find('#mb_prize5_item0').text().trim(),
            tb_kqmb.find('#mb_prize5_item1').text().trim(),
            tb_kqmb.find('#mb_prize5_item2').text().trim(),
            tb_kqmb.find('#mb_prize5_item3').text().trim(),
            tb_kqmb.find('#mb_prize5_item4').text().trim(),
            tb_kqmb.find('#mb_prize5_item5').text().trim(),
        ],
        g_6: [
            tb_kqmb.find('#mb_prize6_item0').text().trim(),
            tb_kqmb.find('#mb_prize6_item1').text().trim(),
            tb_kqmb.find('#mb_prize6_item2').text().trim(),
        ],
        g_7: [
            tb_kqmb.find('#mb_prize7_item0').text().trim(),
            tb_kqmb.find('#mb_prize7_item1').text().trim(),
            tb_kqmb.find('#mb_prize7_item2').text().trim(),
            tb_kqmb.find('#mb_prize7_item3').text().trim(),
        ],
    };

    return {
        success: true,
        data: kq,
        message: "Thao tác thành công"
    };
};

app.get("/", async function(req, res) {
    let date = now();

    let day = addZero(req.query.day || date.getDate());
    let month = addZero(req.query.month || (date.getMonth() + 1));
    let year = addZero(req.query.year || date.getFullYear());
    let kq = await getKqxs(day, month, year);
    
    if(kq.success) {
        res.json(kq);
    } else {
        res.status(400).json(kq);
    }
});

function now() {
    return new Date(Date.now());
}

function addZero(num) {
    return num < 10 ? `0${num}` : num;
}
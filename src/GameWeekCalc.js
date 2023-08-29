import { POSITIONS } from "./Data.js"
import { FplTeamData } from "./FplTeam.js";

export function GameWeekCalc(start_team, transfers, onCompleted) {

    var gws = [];
    for (var g = 0; g < 38; g++) {
        const gw = g+1;
        var gw_team = g === 0 ? new FplTeamData(start_team) : new FplTeamData(gws[g-1].team);
        //apply transfers for this gw:
        var out_trans = []
        for(const [i, trans] of transfers[g].entries()){
            out_trans.push({
                pos: trans.pos,
                id: trans.id,
                out_team: gw_team.players[trans.pos][trans.id].team,
                in_team : trans.in_team
            })
            gw_team.players[trans.pos][trans.id].team = trans.in_team;
        }
        var p_list = []
        for (const [i, pos] of POSITIONS.entries()) {
            for (const [j, player] of gw_team.players[pos].entries()) {
                gw_team.players[pos][j].playing = false;
                p_list.push(player);
            }
        }
        p_list.sort((a, b) => {
            const A_FIXT = a.get_fixture(gw);
            var x = A_FIXT.fdr - b.get_fixture(gw).fdr;
            if (x === 0) {
                A_FIXT.site === "H" ? x -= 0.1 : x += 0.1;
            }
            return x
        });
        // Test sorting of list:
        // for(const [i,player] of p_list.entries()){
        //     console.log(player.team + " vs " + player.get_fixture(props.gw).opponent + " => " + player.get_fixture(props.gw).fdr)
        // }
        var pos_count = { "GK": 0, "DEF": 0, "MID": 0, "FWD": 0 };
        const POS_MIN = { "GK": 1, "DEF": 3, "MID": 3, "FWD": 1 };
        var playing_team = { "GK": [], "DEF": [], "MID": [], "FWD": [] };
        var added = 0;
        var fdr_sum = 0;
        for (const [i, pos] of POSITIONS.entries()) {
            for (const [j, player] of p_list.entries()) {
                if (player.pos !== pos) continue;
                if (player.playing) continue;
                if (pos_count[pos] < POS_MIN[pos]) {
                    p_list[j].playing = true;
                    pos_count[pos]++;
                    added++;
                    gw_team.players[pos][player.id].playing = true;
                    playing_team[pos].push(player);
                    fdr_sum += player.get_fixture(gw).fdr;
                }
            }
        }
        for (const [j, player] of p_list.entries()) {
            if (player.playing) continue;
            if (player.pos === "GK") continue;
            p_list[j].playing = true;
            added++;
            gw_team.players[player.pos][player.id].playing = true;
            playing_team[player.pos].push(player);
            fdr_sum += player.get_fixture(gw).fdr;
            if (added === 11) break;
        }
        var bench = [];
        for (const [i, pos] of POSITIONS.entries()) {
            for (const [j, player] of gw_team.players[pos].entries()) {
                if (!player.playing)
                    bench.push(player);
            }
        }
        var fdr_col = 2;
        if (fdr_sum > 25) fdr_col = 3;
        if (fdr_sum > 29) fdr_col = 4;
        if (fdr_sum > 33) fdr_col = 5;

        for (const [i, pos] of POSITIONS.entries()) {
            playing_team[pos].sort((a,b) => a.id - b.id);
        }

        gws.push({
            team : gw_team,
            playing_team : playing_team,
            bench : bench,
            fdr_sum : fdr_sum,
            fdr_col : fdr_col,
            out_trans : out_trans
        })
    }
    onCompleted(gws);
}

import './App.css';
import { TEAMS, IMG, FIXTURES } from "./Data.js"

export function TeamSelect(props) {
    function scaleFDR(fdr, gw_offset, gw_offset_max){
        const OFF_SCALE = 6;
        return fdr * ((OFF_SCALE + gw_offset_max)/(OFF_SCALE + gw_offset_max + gw_offset))
    }
    const GW_MAX = 5;
    var sorted_teams = TEAMS.slice();
    sorted_teams.sort((a, b) => {
        var fdr_sum = [0.0, 0.0];
        var t_arr = [a, b];
        for (const [i, team] of t_arr.entries()) {
            for (var j = 0; j < GW_MAX; j++) {
                const g = props.gw + j - 1;
                if (g >= 38) break;
                fdr_sum[i] += scaleFDR(FIXTURES[team][g].fdr, j, GW_MAX-1);
            }
        }
        return fdr_sum[0] - fdr_sum[1];
    });

    // for (const [i, team] of sorted_teams.entries()) {
    //     if (team === "AVL" || team === "TOT") {
    //         var fdr_sum = 0.0
    //         var as_txt = ""
    //         for (var j = 0; j < GW_MAX; j++) {
    //             const g = props.gw + j - 1;
    //             if (g >= 38) break;
    //             const add = scaleFDR(FIXTURES[team][g].fdr, j, GW_MAX-1);
    //             if(j > 0) as_txt += " + "
    //             as_txt += add.toFixed(2)
    //             fdr_sum += add;
    //         }
    //         console.log(team + " " + fdr_sum.toFixed(2) + " (" + as_txt + ")");
    //     }
    // }
    var teams = []
    for (const [i, team] of sorted_teams.entries()) {
        var next_fix_row = []
        for (var j = 0; j < 4; j++) {
            const g = props.gw + j;
            const brd_right = j < 3 && g < 37 ? " brd-right" : "";
            if (g >= 38) break;
            next_fix_row.push(
                <div className={'f1 fix_icon brd-top fdr_' + FIXTURES[team][g].fdr + brd_right} key={j}>

                </div>
            )
        }
        teams.push(
            <div className={"brd w10 mall1 cp center"} onClick={() => props.onClickTeam(team)} key={i}>
                <div className={"small-txt"}>
                    {team}
                </div>
                <div className={"fdr_" + FIXTURES[team][props.gw - 1].fdr}>
                    <img className="shirt trans-mid" src={IMG[team]} alt={team} />
                </div>
                <div className={"small-txt row"}>
                    {next_fix_row}
                </div>
            </div>
        )
    }
    return (
        <div className={"col"}>
            {"Select " + props.selPos}
            <div className='small-txt'>{"Sorted by " + GW_MAX + " week FDR from GW " + props.gw + " (first GWs weight more than later GWs)"}</div>
            <div className={"row wrap"}>
                {teams}
            </div>
        </div>
    );
}

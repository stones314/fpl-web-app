import './App.css';
import { TEAMS, IMG, FIXTURES } from "./Data.js"

export function TeamSelect(props) {
    var teams = []
    for (const [i, team] of TEAMS.entries()) {
        var next_fix_row = []
        for (var j = 0; j < 4; j++) {
            const g = props.gw + j;
            const brd_right = j < 3 && g < 37 ? " brd-right" : "";
            if(g >= 38) break;
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
                <div className={"fdr_" + FIXTURES[team][props.gw-1].fdr}>
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
            <div className={"row wrap"}>
                {teams}
            </div>
        </div>
    );
}

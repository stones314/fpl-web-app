import { IMG } from "./Data.js"
import { TransferView } from "./Transfer.js";
import { TeamErr } from "./FplTeam.js";
import './App.css';

function PlayerRow(props) {
    function add_new_icon(do_add) {
        if (!do_add) return null;
        return (
            <div className={"f2"}>
                <img className="new-icon" src={IMG["new2"]} alt={"new2"} />
            </div>
        )
    }
    var players = []
    for (const [i, player] of props.players.entries()) {
        const FIXT = player.get_fixture(props.gw);
        var trans = false;
        for (const [i, t] of props.transfers.entries()) {
            if (t.pos === player.pos && t.id === player.id) trans = t.in_team !== props.out_trans[i].out_team;
        }
        var next_fix_row = []
        for (var j = 0; j < 4; j++) {
            const g = props.gw + j;
            const brd_right = j < 3 && g < 37 ? " brd-right" : "";
            if (g >= 38) break;
            next_fix_row.push(
                <div className={'f1 fix_icon brd-top fdr_' + player.get_fixture(g + 1).fdr + brd_right} key={j}>

                </div>
            )
        }
        players.push(
            <div className={"cp mall w20p brd"}
                key={i}
                onClick={() => props.onClickPlayer(player.pos, player.id, props.gw)}
            >
                <div className="row">
                    <div className="small-txt f3">
                        {player.pos + (player.id + 1).toString()}
                    </div>
                    {add_new_icon(trans)}
                </div>
                <div className={"fdr_" + FIXT.fdr}>
                    <img className="shirt trans-mid" src={IMG[player.team]} alt={player.team} />
                </div>
                <div className="small-txt">
                    {FIXT.opponent + " (" + FIXT.site + ")"}
                </div>
                <div className={"small-txt row"}>
                    {next_fix_row}
                </div>
            </div>
        )
    }
    return (
        <div className="row center">
            {players}
        </div>
    )
}

export function GameWeek(props) {
    return (
        <div className={"col w100p"}>
            <div className={"mid cp brd fdr_" + props.team.fdr_col} onClick={() => props.onClickGw(props.gw)}>
                {"Gameweek " + props.gw + " (" + props.team.fdr_sum + " FDR)"}
            </div>
            <PlayerRow
                name="GK"
                players={props.team.playing_team["GK"]}
                gw={props.gw}
                onClickPlayer={(pos, id, gw) => props.onClickPlayer(pos, id, gw)}
                transfers={props.trans}
                out_trans={props.team.out_trans}
            />
            <PlayerRow
                name="DEF"
                players={props.team.playing_team["DEF"]}
                gw={props.gw}
                onClickPlayer={(pos, id, gw) => props.onClickPlayer(pos, id, gw)}
                transfers={props.trans}
                out_trans={props.team.out_trans}
            />
            <PlayerRow
                name="MID"
                players={props.team.playing_team["MID"]}
                gw={props.gw}
                onClickPlayer={(pos, id, gw) => props.onClickPlayer(pos, id, gw)}
                transfers={props.trans}
                out_trans={props.team.out_trans}
            />
            <PlayerRow
                name="FWD"
                players={props.team.playing_team["FWD"]}
                gw={props.gw}
                onClickPlayer={(pos, id, gw) => props.onClickPlayer(pos, id, gw)}
                transfers={props.trans}
                out_trans={props.team.out_trans}
            />
            <PlayerRow
                name="Bench"
                players={props.team.bench}
                gw={props.gw}
                onClickPlayer={(pos, id, gw) => props.onClickPlayer(pos, id, gw)}
                transfers={props.trans}
                out_trans={props.team.out_trans}
            />
            <TransferView
                transfers={props.trans}
                out_trans={props.team.out_trans}
                onDelTrans={(gw, id) => props.onDelTrans(gw, id)}
            />
            <TeamErr
                errs={props.team.team.checkValid()}
            />
        </div>
    );
}

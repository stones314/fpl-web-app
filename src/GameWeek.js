import { FIXTURES, TEAMS, POSITIONS, PlayerData, IMG } from "./Data.js"
import { TransferView } from "./Transfer.js";
import './App.css';

function PlayerRow(props) {
    function add_new_icon(do_add) {
        if (!do_add) return null;
        return (
            <div className={"f1"}>
                <img className="new_icon" src={IMG["new2"]} alt={"new2"} />
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
        players.push(
            <div className={"cp mall w20p brd " + "fdr_" + FIXT.fdr}
                key={i}
                onClick={() => props.onClickPlayer(player.pos, player.id, props.gw)}
            >
                <div className="row">
                    <div className="small-txt f3">
                        {player.pos + (player.id + 1).toString()}
                    </div>
                    {add_new_icon(trans)}
                </div>
                <div className="">
                    {player.team}
                </div>
                <div className="small-txt">
                    {FIXT.opponent + " (" + FIXT.site + ")"}
                </div>
            </div>
        )
    }
    return (
        <div className="small row center">
            {players}
        </div>
    )
}

export function GameWeek(props) {
    return (
        <div className={"col"}>
            <div className={"mid brd fdr_" + props.team.fdr_col}>
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
            />
        </div>
    );
}

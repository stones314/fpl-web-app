import { useState } from "react";
// import Cookies from "universal-cookie";
import './App.css';
import { POSITIONS, PlayerData } from "./Data";

export class FplTeamData {
    constructor(cookie_data = null) {
        this.players = { "GK": [], "DEF": [], "MID": [], "FWD": [] };
        if (cookie_data) {
            for (const [i, pos] of POSITIONS.entries()) {
                for (const [j, pd] of cookie_data.players[pos].entries()) {
                    this.players[pos].push(new PlayerData(pd.team, pd.pos, pd.id, pd.playing));
                }
            }
            return;
        }
        this.players = {
            "GK": [
                new PlayerData("MCI", "GK", 0, true),
                new PlayerData("NFO", "GK", 1, false)
            ],
            "DEF": [
                new PlayerData("ARS", "DEF", 0, true),
                new PlayerData("CHE", "DEF", 1, true),
                new PlayerData("TOT", "DEF", 2, true),
                new PlayerData("BHA", "DEF", 3, true),
                new PlayerData("NEW", "DEF", 4, false)
            ],
            "MID": [
                new PlayerData("ARS", "MID", 0, true),
                new PlayerData("MCI", "MID", 1, true),
                new PlayerData("WHU", "MID", 2, true),
                new PlayerData("BRE", "MID", 3, true),
                new PlayerData("BHA", "MID", 4, false)
            ],
            "FWD": [
                new PlayerData("MCI", "FWD", 0, true),
                new PlayerData("ARS", "FWD", 1, true),
                new PlayerData("CHE", "FWD", 2, false)
            ]
        }
    }
}

function PlayerRow(props) {
    var players = []
    for (const [i, player] of props.players.entries()) {
        var sel = ""
        if (player.pos === props.selPos && i === props.selId)
            sel = " sel"
        players.push(
            <div className={"cp mall w20p brd" + sel} onClick={() => props.onClickPlayer(player.pos, i)} key={i}>
                <div className="small-txt f3">
                    {player.pos + (player.id + 1).toString()}
                </div>
                <div className="">
                    {player.team}
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

export function FplTeam(props) {
    return (
        <div className={"col center"}>
            <div className="">
                Select starting team here
            </div>
            <PlayerRow
                name="GK"
                players={props.gks}
                selPos={props.selPos}
                selId={props.selId}
                onClickPlayer={(pos, id) => props.onClickPlayer(pos, id)}
            />
            <PlayerRow
                name="DEF"
                players={props.defs}
                selPos={props.selPos}
                selId={props.selId}
                onClickPlayer={(pos, id) => props.onClickPlayer(pos, id)}
            />
            <PlayerRow
                name="MID"
                players={props.mids}
                selPos={props.selPos}
                selId={props.selId}
                onClickPlayer={(pos, id) => props.onClickPlayer(pos, id)}
            />
            <PlayerRow
                name="FWD"
                players={props.fwds}
                selPos={props.selPos}
                selId={props.selId}
                onClickPlayer={(pos, id) => props.onClickPlayer(pos, id)}
            />
        </div>
    );
}

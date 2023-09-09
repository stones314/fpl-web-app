import { useState } from "react";
// import Cookies from "universal-cookie";
import './App.css';
import { POSITIONS, PlayerData, IMG, TEAMS } from "./Data";

export class FplTeamData {
    constructor(cookie_data = null) {
        this.players = { "GK": [], "DEF": [], "MID": [], "FWD": [] };
        this.errors = []
        if (cookie_data) {
            for (const [i, pos] of POSITIONS.entries()) {
                for (const [j, pd] of cookie_data.players[pos].entries()) {
                    this.players[pos].push(new PlayerData(pd.team, pd.pos, pd.id, pd.playing));
                }
            }
            this.errors = this.checkValid();
            return;
        }
        this.players = {
            "GK": [
                new PlayerData("WHU", "GK", 0, true),
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
                new PlayerData("MUN", "MID", 2, true),
                new PlayerData("BRE", "MID", 3, true),
                new PlayerData("BHA", "MID", 4, false)
            ],
            "FWD": [
                new PlayerData("MCI", "FWD", 0, true),
                new PlayerData("BHA", "FWD", 1, true),
                new PlayerData("CHE", "FWD", 2, false)
            ]
        }
    }

    checkValid() {
        var team_count = {};
        for (const [i, team] of TEAMS.entries()){
            team_count[team] = 0;
        }
        for (const [i, pos] of POSITIONS.entries()) {
            for (const [j, pd] of this.players[pos].entries()) {
                team_count[pd.team]++;
            }
        }
        var errors = []
        for (const [i, team] of TEAMS.entries()){
            if (team_count[team] > 3){
                errors.push("Too many players from " + team);
            }
        }
        return errors;
    }
}

export function TeamErr(props){
    if (props.errs.length === 0) return null;
    var errs = []
    for (const [i, err] of props.errs.entries()){
        errs.push(
            <div className="err" key={i}>
                {err}
            </div>
        )
    }
    return(
        <div className="">
            {errs}
        </div>
    )
}

function PlayerRow(props) {
    var players = []
    for (const [i, player] of props.players.entries()) {
        var sel = ""
        if (player.pos === props.selPos && i === props.selId)
            sel = " sel"
        players.push(
            <div className={"cp mall w10 brd" + sel} onClick={() => props.onClickPlayer(player.pos, i)} key={i}>
                <div className="small-txt f3">
                    {player.pos + (player.id + 1).toString()}
                </div>
                <div className={""}>
                    <img className="shirt trans-mid" src={IMG[player.team]} alt={player.team} />
                </div>
                <div className="small-txt">
                    {player.team}
                </div>
            </div>
        )
    }
    return (
        <div className="row center w100p">
            {players}
        </div>
    )
}

export function FplTeam(props) {
    return (
        <div className={"col center w100p"}>
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

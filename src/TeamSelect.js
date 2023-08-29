import './App.css';
import {TEAMS} from "./Data.js"

export function TeamSelect(props) {
    var teams = []
    for (const [i, team] of TEAMS.entries()){
        teams.push(
            <div className='brd cp' onClick={() => props.onClickTeam(team)} key={i}>
                {team}
            </div>
        )
    }
    return (
        <div className={"col"}>
            {"Select " + props.selPos}
            <div className={"col"}>
                {teams}
            </div>
        </div>
    );
}

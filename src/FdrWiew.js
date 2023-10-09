import { IMG, TEAMS, FIXTURES } from "./Data.js"
import { TransferView } from "./Transfer.js";
import { TeamErr } from "./FplTeam.js";
import './App.css';

function TeamCol(props) {
    var fixtures = []
    fixtures.push(
        <div className={"fdr_h"}
            key={-1}
        >
            {props.gw}
        </div>
    )
    for (const [i, team] of TEAMS.entries()) {
        if (props.name_only) {
            fixtures.push(
                <div className={"fdr_h"}
                    key={i}
                >
                    {team}
                </div>
            )
        }
        else {
            const fix = FIXTURES[team][props.gw - 1];
            fixtures.push(
                <div className={"col fdr_h fdr_" + fix.fdr}
                    key={i}
                >
                    <div className="mid-txt">{fix.opponent}</div>
                    <div className="small-txt">{fix.site}</div>
                </div>
            )
        }
    }
    return (
        <div className="col">
            {fixtures}
        </div>
    )
}

function GwRows(props) {
    var team_cols = [];
    team_cols.push(
        <TeamCol
            key={0}
            gw={"FDR"}
            name_only={true}
        />
    )
    for (var gw = props.gw; gw < props.gw + props.num_gw; gw++) {
        team_cols.push(
            <TeamCol
                key={gw}
                gw={gw}
                name_only={false}
            />
        )
    }
    return (
        <div className="row">
            {team_cols}
        </div>
    )
}

export function FdrView(props) {
    return (
        <div className={""}>
            <GwRows
                gw={props.gw}
                num_gw={10}
            />
        </div>
    );
}

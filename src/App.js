import './App.css';
import { useState } from "react";
import Cookies from "universal-cookie";
import { FIXTURES, TEAMS, PlayerData, POSITIONS } from "./Data.js"
import { FplTeam, FplTeamData } from "./FplTeam.js"
import { TeamSelect } from "./TeamSelect.js"
import { GameWeek } from './GameWeek';
import { GameWeekCalc } from './GameWeekCalc';
import { TransferView, TransferList } from './Transfer';

const PAGE_LOAD = 1;
const PAGE_READY = 2;

function App() {
  const cookies = new Cookies();
  const [team, setTeam] = useState(
    cookies.get("fpl_teamd")
      ? new FplTeamData(cookies.get("fpl_team"))
      : new FplTeamData()
  );
  const [trans, setTrans] = useState(
    cookies.get("fpl_transd")
      ? new TransferList(cookies.get("fpl_trans"))
      : new TransferList()
  );
  const [selected, setSelected] = useState({ pos: "NA", id: -1 })
  const [fdrSum, setFdrSum] = useState(0)
  const [pageState, setPageState] = useState(PAGE_LOAD)
  const [gws, setGws] = useState(undefined)
  const [gwpSel, setGwpSel] = useState({ pos: "NA", id: -1, gw: 0 })

  function isTeamFull() {
    for (const [i, pos] of POSITIONS.entries()) {
      for (const [j, player] of team.players[pos].entries()) {
        if (player.team === "UNK") return false;
      }
    }
    return true;
  }

  function onGwsCalcComplete(new_gws) {
    setGws(new_gws)
    setPageState(PAGE_READY)
  }

  function onClickPlayer(pos, i) {
    var new_sel = { pos: pos, id: i };
    if (selected.id === i && selected.pos === pos)
      new_sel.id = -1
    setSelected(new_sel);
  }

  function onClickTeam(team_name) {
    var new_team = new FplTeamData(team);
    new_team.players[selected.pos][selected.id].team = team_name;
    setTeam(new_team)
    var new_sel = { pos: "", id: -1 };
    setSelected(new_sel);
    if (isTeamFull()) {
      setPageState(PAGE_LOAD)
      GameWeekCalc(new_team, trans.gws, (new_gws) => onGwsCalcComplete(new_gws))
      cookies.set("fpl_team", new_team, { path: "/" });
    }
  }

  function onClickGwPlayer(pos, i, gw) {
    var new_sel = { pos: pos, id: i, gw: gw };
    if (gwpSel.id === i && gwpSel.pos === pos && gwpSel.gw === gw)
      new_sel.id = -1
    setGwpSel(new_sel);
  }

  function onClickTransTeam(team_name) {
    var new_trans = new TransferList(trans);
    var new_sel = { pos: "", id: -1, gw: 0 };
    setGwpSel(new_sel);
    new_trans.add_transfer(gwpSel.gw, gwpSel.pos, team_name, gwpSel.id);
    setTrans(new_trans);
    setPageState(PAGE_LOAD);
    GameWeekCalc(team, new_trans.gws, (new_gws) => onGwsCalcComplete(new_gws));
    cookies.set("fpl_trans", new_trans, { path: "/" });
}

  function renderTeamSelect() {
    if (selected.id === -1) return

    return (
      <TeamSelect
        selPos={selected.pos}
        onClickTeam={(team_name) => onClickTeam(team_name)}
      />
    )
  }

  function renderTransTeamSelect() {
    if (gwpSel.id === -1) return;

    return (
      <TeamSelect
        selPos={selected.pos}
        onClickTeam={(team_name) => onClickTransTeam(team_name)}
      />
    )
  }

  function renderGameWeek() {
    if (!isTeamFull()) return null;
    if (pageState === PAGE_LOAD) return null;
    var gws_view = [];
    const MAX_GW = 38
    const COLS = 2
    for (var i = 0; i < MAX_GW / COLS; i++) {
      var row = [];
      var gw_start = i * COLS + 1;
      for (var j = 0; j < COLS; j++) {
        const gw = gw_start + j;
        row.push(
          <GameWeek
            team={gws[gw - 1]}
            trans={trans.gws[gw - 1]}
            gw={gw}
            key={j}
            onClickPlayer={(pos, id, gw) => onClickGwPlayer(pos, id, gw)}
          />
        )
      }
      var show_team_select = false;
      if (gwpSel.gw >= gw_start && gwpSel.gw < gw_start + COLS)
        show_team_select = true;
      gws_view.push(
        <div className='col' key={i}>
          <div className='row'>
            {row}
          </div>
          {show_team_select ? renderTransTeamSelect() : null}
        </div>
      )
    }
    return (
      <div className='col center'>
        {gws_view}
      </div>
    )
  }

  return (
    <div className="col">
      <FplTeam
        gks={team.players["GK"]}
        defs={team.players["DEF"]}
        mids={team.players["MID"]}
        fwds={team.players["FWD"]}
        selPos={selected.pos}
        selId={selected.id}
        onClickPlayer={(pos, id) => onClickPlayer(pos, id)}
      />
      {renderTeamSelect()}
      <div className='center'>
        Gameweeks optimized for FDR displayed below
      </div>
      <div className='center'>
        Click on a player in a gameweek to make a transfer.
      </div>
      {renderGameWeek()}
    </div>
  );
}

export default App;

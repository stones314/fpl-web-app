import './App.css';
import { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { POSITIONS, IMG } from "./Data.js"
import { FplTeam, FplTeamData, TeamErr } from "./FplTeam.js"
import { TeamSelect } from "./TeamSelect.js"
import { GameWeek } from './GameWeek';
import { GameWeekCalc } from './GameWeekCalc';
import { TransferList } from './Transfer';

const PAGE_LOAD = 1;
const PAGE_READY = 2;

function App() {
  const cookies = new Cookies();
  const [team, setTeam] = useState(
    cookies.get("fpl_team")
      ? new FplTeamData(cookies.get("fpl_team"))
      : new FplTeamData()
  );
  const [trans, setTrans] = useState(
    cookies.get("fpl_trans")
      ? new TransferList(cookies.get("fpl_trans"))
      : new TransferList()
  );
  const [selected, setSelected] = useState({ pos: "NA", id: -1 })
  const [pageState, setPageState] = useState(PAGE_LOAD)
  const [gws, setGws] = useState(undefined)
  const [gwpSel, setGwpSel] = useState({ pos: "NA", id: -1, gw: 0 })
  const [startGw, setStartGw] = useState(
    cookies.get("fpl_start")
      ? cookies.get("fpl_start")
      : 1
  )
  const [teamErr, setTearErr] = useState([])

  useEffect(() => {
    GameWeekCalc(team, trans.gws, (new_gws) => onGwsCalcComplete(new_gws), startGw);
  }, []);


  function isTeamFull() {
    for (const [i, pos] of POSITIONS.entries()) {
      for (const [j, player] of team.players[pos].entries()) {
        if (player.team === "UNK") return false;
      }
    }
    return true;
  }

  function onGwsCalcComplete(new_gws, fdr_total) {
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
    setTearErr(new_team.checkValid());
    var new_sel = { pos: "", id: -1 };
    setSelected(new_sel);
    if (isTeamFull()) {
      setPageState(PAGE_LOAD)
      GameWeekCalc(new_team, trans.gws, (new_gws, fdr_total) => onGwsCalcComplete(new_gws, fdr_total), startGw)
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
    GameWeekCalc(team, new_trans.gws, (new_gws, fdr_total) => onGwsCalcComplete(new_gws, fdr_total), startGw);
    cookies.set("fpl_trans", new_trans, { path: "/" });
  }

  function onDelTrans(gw, id) {
    var new_trans = new TransferList(trans);
    new_trans.del_transfer(gw, id);
    setTrans(new_trans);
    setPageState(PAGE_LOAD);
    GameWeekCalc(team, new_trans.gws, (new_gws, fdr_total) => onGwsCalcComplete(new_gws, fdr_total), startGw);
    cookies.set("fpl_trans", new_trans, { path: "/" });
  }

  function onClickGw(gw) {
    var s = gw;
    if (gw === startGw && s > 1) {
      s--;
    }
    setStartGw(s);
    cookies.set("fpl_start", s, { path: "/" });
    setPageState(PAGE_LOAD);
    GameWeekCalc(team, trans.gws, (new_gws, fdr_total) => onGwsCalcComplete(new_gws, fdr_total), s);
  }

  function renderTeamSelect() {
    if (selected.id === -1) return

    return (
      <TeamSelect
        gw={startGw}
        selPos={selected.pos}
        onClickTeam={(team_name) => onClickTeam(team_name)}
      />
    )
  }

  function renderTransTeamSelect() {
    if (gwpSel.id === -1) return;

    return (
      <TeamSelect
        gw={gwpSel.gw}
        selPos={gwpSel.pos + (gwpSel.id + 1).toString()}
        onClickTeam={(team_name) => onClickTransTeam(team_name)}
      />
    )
  }

  function renderGwSelect() {
    return (
      <div className='narrow row center mtb2'>
        <div className='f3 big-txt'>
        </div>
        <div className='f4 big-txt'>
          {"Start from GW:"}
        </div>
        <div className='f2 row'>
          {startGw > 1 ?
            <div className='f1 cp xbig-txt' onClick={() => { setStartGw(startGw - 1) }}>
              {"<"}
            </div>
            : <div className='f1 opac xbig-txt'>
              {"<"}
            </div>
          }
          <div className='f1 xbig-txt'>
            {startGw}
          </div>
          {startGw < 38 ?
            <div className='f1 cp xbig-txt' onClick={() => { setStartGw(startGw + 1) }}>
              {">"}
            </div>
            : <div className='f1 opac xbig-txt'>
              {">"}
            </div>
          }
        </div>
        <div className='f4 big-txt'>
        </div>
      </div>
    )
  }

  function renderGameWeek() {
    if (!isTeamFull()) return null;
    if (pageState === PAGE_LOAD) return null;
    var gws_view = [];
    const MAX_GW = 38;
    const COLS = 2;
    for (var g = startGw - 1; g < MAX_GW; g += COLS) {
      var row = [];
      for (var j = 0; j < COLS; j++) {
        const gw = g + j + 1;
        if (gw > MAX_GW) break;
        row.push(
          <GameWeek
            team={gws[gw - 1]}
            trans={trans.gws[gw - 1]}
            gw={gw}
            key={j}
            onClickPlayer={(pos, id, gw) => onClickGwPlayer(pos, id, gw)}
            onDelTrans={(gw, id) => onDelTrans(gw, id)}
            onClickGw={(gw) => onClickGw(gw)}
          />
        )
      }
      var show_team_select = false;
      if (gwpSel.gw >= g + 1 && gwpSel.gw < g + 1 + COLS)
        show_team_select = true;
      gws_view.push(
        <div className='col w100p' key={g}>
          <div className='row w100p'>
            {row}
          </div>
          {show_team_select ? renderTransTeamSelect() : null}
        </div>
      )
    }
    return (
      <div className='col w100p center'>
        {gws_view}
      </div>
    )
  }

  if (pageState === PAGE_LOAD) return null;

  /*
      <FplTeam
        gks={team.players["GK"]}
        defs={team.players["DEF"]}
        mids={team.players["MID"]}
        fwds={team.players["FWD"]}
        selPos={selected.pos}
        selId={selected.id}
        onClickPlayer={(pos, id) => onClickPlayer(pos, id)}
      />
      <TeamErr
        errs={teamErr}
      />
      {renderTeamSelect()}
*/
  return (
    <div className="narrow col center trans-mid">
      <b>
        Fixture Planner
      </b>
      <div className='center small-txt'>
        Select initial team here.
      </div>
      <FplTeam
        gks={team.players["GK"]}
        defs={team.players["DEF"]}
        mids={team.players["MID"]}
        fwds={team.players["FWD"]}
        selPos={selected.pos}
        selId={selected.id}
        onClickPlayer={(pos, id) => onClickPlayer(pos, id)}
      />
      <TeamErr
        errs={teamErr}
      />
      {renderTeamSelect()}
      {renderGwSelect()}
      <div className='center small-txt'>
        Starting XI with lowest FDR is shown each gameweek.
      </div>
      <div className='center small-txt'>
        Click on a player in a gameweek to make a transfer for that gameweek and forward.
      </div>
      {renderGameWeek()}
    </div>
  );
}

export default App;

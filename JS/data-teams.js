// 英超球隊資料陣列，每個元素都是一支球隊的物件
// 內容包含 id、name（完整隊名）、shortName（簡稱）、crest（隊徽路徑）
const premierLeagueTeams = [
  { id: 1,  name: "Arsenal",                  shortName: "Arsenal",        crest: "./img/team/arsenal.svg" },
  { id: 2,  name: "Aston Villa",              shortName: "Aston Villa",    crest: "./img/team/aston-villa.svg" },
  { id: 3,  name: "AFC Bournemouth",          shortName: "Bournemouth",    crest: "./img/team/bournemouth.svg" },
  { id: 4,  name: "Brentford",                shortName: "Brentford",      crest: "./img/team/brentford.svg" },
  { id: 5,  name: "Brighton & Hove Albion",   shortName: "Brighton",       crest: "./img/team/brighton.svg" },
  { id: 6,  name: "Chelsea",                  shortName: "Chelsea",        crest: "./img/team/chelsea.svg" },
  { id: 7,  name: "Crystal Palace",           shortName: "Crystal Palace", crest: "./img/team/crystal-palace.svg" },
  { id: 8,  name: "Everton",                  shortName: "Everton",        crest: "./img/team/everton.svg" },
  { id: 9,  name: "Fulham",                   shortName: "Fulham",         crest: "./img/team/fulham.svg" },
  { id: 10, name: "Ipswich Town",             shortName: "Ipswich",        crest: "./img/team/ipswich.svg" },
  { id: 11, name: "Leicester City",           shortName: "Leicester",      crest: "./img/team/leicester.svg" },
  { id: 12, name: "Liverpool",                shortName: "Liverpool",      crest: "./img/team/liverpool.svg" },
  { id: 13, name: "Manchester City",          shortName: "Man City",       crest: "./img/team/man-city.svg" },
  { id: 14, name: "Manchester United",        shortName: "Manchester Utd", crest: "./img/team/man-united.svg" },
  { id: 15, name: "Newcastle United",         shortName: "Newcastle",      crest: "./img/team/newcastle.svg" },
  { id: 16, name: "Nottingham Forest",        shortName: "Nottingham",     crest: "./img/team/nottingham-forest.svg" },
  { id: 17, name: "Tottenham Hotspur",        shortName: "Tottenham",      crest: "./img/team/tottenham.svg" },
  { id: 18, name: "West Ham United",          shortName: "West Ham",       crest: "./img/team/west-ham.svg" },
  { id: 19, name: "Wolverhampton Wanderers",  shortName: "Wolves",         crest: "./img/team/wolves.svg" },
  { id: 20, name: "Southampton",              shortName: "Southampton",    crest: "./img/team/southampton.svg" },
  { id: 21, name: "Burnley",                                               crest: "./img/team/burnley.svg"}, 
  { id: 22, name: "Leeds",                                                 crest: "./img/team/leeds.svg" },
  { id: 23, name: "Sunderland",                                            crest: "./img/team/sunderland.svg" },
];

// 依據隊名（name 或 shortName）找出該隊資料
// find() 找到第一個符合條件的球隊物件；找不到則回傳 null
function getTeamMeta(teamName) {
  return (
    premierLeagueTeams.find(
      t => t.name === teamName || t.shortName === teamName
    ) || null
  );
}
type SportType =
  | "American Football"
  | "Baseball"
  | "Basketball"
  | "Soccer"
  | "Handball"
  | "Ice Hockey"
  | "Rugby"
  | "Volleyball"

const sportStatusMap: Record<SportType, Record<string, string>> = {
  "American Football": {
    NS: "Not Started",
    Q1: "First Quarter",
    Q2: "Second Quarter",
    Q3: "Third Quarter",
    Q4: "Fourth Quarter",
    OT: "Overtime",
    HT: "Halftime",
    FT: "Finished",
    AOT: "After Overtime",
    CANC: "Cancelled",
    PST: "Postponed",
  },
  Baseball: {
    NS: "Not Started",
    IN1: "Inning 1",
    IN2: "Inning 2",
    IN3: "Inning 3",
    IN4: "Inning 4",
    IN5: "Inning 5",
    IN6: "Inning 6",
    IN7: "Inning 7",
    IN8: "Inning 8",
    IN9: "Inning 9",
    POST: "Postponed",
    CANC: "Cancelled",
    INTR: "Interrupted",
    ABD: "Abandoned",
    FT: "Finished",
  },
  Basketball: {
    NS: "Not Started",
    Q1: "Quarter 1",
    Q2: "Quarter 2",
    Q3: "Quarter 3",
    Q4: "Quarter 4",
    OT: "Overtime",
    BT: "Break Time",
    HT: "Halftime",
    FT: "Finished",
    AOT: "After Overtime",
    POST: "Postponed",
    CANC: "Cancelled",
    SUSP: "Suspended",
    AWD: "Awarded",
    ABD: "Abandoned",
  },
  Soccer: {
    TBD: "To Be Defined",
    NS: "Not Started",
    "1H": "First Half",
    HT: "Halftime",
    "2H": "Second Half",
    ET: "Extra Time",
    P: "Penalty In Progress",
    FT: "Finished",
    AET: "After Extra Time",
    PEN: "Penalties",
    BT: "Break Time",
    SUSP: "Suspended",
    INT: "Interrupted",
    PST: "Postponed",
    CANC: "Cancelled",
    ABD: "Abandoned",
    AWD: "Technical Loss",
    WO: "Walkover",
  },
  Handball: {
    NS: "Not Started",
    "1H": "First Half",
    "2H": "Second Half",
    HT: "Halftime",
    ET: "Extra Time",
    BT: "Break Time",
    PT: "Penalties",
    AW: "Awarded",
    POST: "Postponed",
    CANC: "Cancelled",
    INTR: "Interrupted",
    ABD: "Abandoned",
    WO: "Walkover",
    AET: "After Extra Time",
    AP: "After Penalties",
    FT: "Finished",
  },
  "Ice Hockey": {
    NS: "Not Started",
    P1: "First Period",
    P2: "Second Period",
    P3: "Third Period",
    OT: "Overtime",
    PT: "Penalties",
    BT: "Break Time",
    AW: "Awarded",
    POST: "Postponed",
    CANC: "Cancelled",
    INTR: "Interrupted",
    ABD: "Abandoned",
    AOT: "After Overtime",
    AP: "After Penalties",
    FT: "Finished",
  },
  Rugby: {
    NS: "Not Started",
    "1H": "First Half",
    "2H": "Second Half",
    HT: "Halftime",
    ET: "Extra Time",
    BT: "Break Time",
    PT: "Penalties",
    AW: "Awarded",
    POST: "Postponed",
    CANC: "Cancelled",
    INTR: "Interrupted",
    ABD: "Abandoned",
    AET: "After Extra Time",
    FT: "Finished",
  },
  Volleyball: {
    NS: "Not Started",
    S1: "Set 1",
    S2: "Set 2",
    S3: "Set 3",
    S4: "Set 4",
    S5: "Set 5",
    AW: "Awarded",
    POST: "Postponed",
    CANC: "Cancelled",
    INTR: "Interrupted",
    ABD: "Abandoned",
    FT: "Finished",
  },
}

export function getEventStatus(sport: SportType, status: string): string {
  return sportStatusMap[sport]?.[status] || status
}

export function isLiveEvent(sport: SportType, status: string): boolean {
  const liveStatuses = ["In Play", "Halftime", "Break Time", "Overtime", "Penalties"]
  const eventStatus = getEventStatus(sport, status)
  return (
    liveStatuses.some((s) => eventStatus.includes(s)) ||
    (sport === "American Football" && ["Q1", "Q2", "Q3", "Q4", "OT"].includes(status)) ||
    (sport === "Baseball" && status.startsWith("IN")) ||
    (sport === "Basketball" && ["Q1", "Q2", "Q3", "Q4", "OT"].includes(status)) ||
    (sport === "Soccer" && ["1H", "2H", "ET", "P"].includes(status)) ||
    (sport === "Ice Hockey" && ["P1", "P2", "P3", "OT"].includes(status)) ||
    (sport === "Volleyball" && ["S1", "S2", "S3", "S4", "S5"].includes(status))
  )
}

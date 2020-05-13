package edu.amrita.timetable;

public class PenaltyConstants
{
    public static Penalty OVERLAP = new Penalty(500,0);
    public static Penalty REGION_GAP = new Penalty(40,0);
    public static Penalty NO_REPEAT_SAME_SLOT = new Penalty(20,0);
    public static Penalty NO_REPEAT_DIFF_SLOT = new Penalty( 0,500);
    public static Penalty NO_LUNCH_COMP = new Penalty( 20,0);
    public static Penalty MANY_DAY_NOLUNCH = new Penalty( 100,0);
}

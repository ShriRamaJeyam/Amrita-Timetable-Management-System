package edu.amrita.timetable;

public class Penalty
{
    public int hard,soft;
    Penalty(int hard,int soft)
    {
        this.soft = soft;
        this.hard = hard;
    }
    public void SubstractScore(Integer h,Integer s)
    {
        h -= this.hard;
        s -= this.soft;
        MapClass.hard -= this.hard;
        MapClass.soft -= this.soft;
    }
}
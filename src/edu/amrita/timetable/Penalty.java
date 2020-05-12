package edu.amrita.timetable;

public class Penalty
{
    public int hard,soft;
    Penalty(int hard,int soft)
    {
        this.soft = soft;
        this.hard = hard;
    }
    public void SubstractScore(Integer hard,Integer soft)
    {
        hard -= this.hard;
        soft -= this.soft;
    }
}
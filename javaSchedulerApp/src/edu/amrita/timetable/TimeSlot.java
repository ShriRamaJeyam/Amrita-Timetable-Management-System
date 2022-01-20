package edu.amrita.timetable;
public class TimeSlot 
{
	TimeSlot()
	{

	}
	TimeSlot(int starter,int ender)
	{
		this.starter = starter;
		this.ender = ender;
	}
	public int id,starter,ender,startBreak,endBreak;
	public boolean hasBreak=false;
	public boolean doesNotIntersect(TimeSlot t)
	{
		if(t.ender <= this.starter || t.starter >= this.ender)
			return true;
		if(t.hasBreak && (t.startBreak <= this.starter) && (t.endBreak >= this.ender))
		{
			return true;
		}
		if(this.hasBreak && (this.startBreak <= t.starter) && (this.endBreak >= t.ender))
		{
			return true;
		}
		return false;
	}
}

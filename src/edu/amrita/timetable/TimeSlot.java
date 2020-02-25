package edu.amrita.timetable;
public class TimeSlot 
{
	private int ID;
	private int start;
	private int end;
	private boolean extended=false;
	private int estart=0;
	private int eend=0;
	public int getStart() {
		return start;
	}
	public void setStart(int start) {
		this.start = start;
	}
	public int getEnd() {
		return end;
	}
	public void setEnd(int end) {
		this.end = end;
	}
	public boolean isExtended() {
		return extended;
	}
	public void setExtended(boolean extended) {
		this.extended = extended;
	}
	public int getEstart() {
		return estart;
	}
	public void setEstart(int estart) {
		this.estart = estart;
	}
	public int getEend() {
		return eend;
	}
	public void setEend(int eend) {
		this.eend = eend;
	}
	public boolean isOverlapping(TimeSlot t) 
	{
		if( ( start >= t.getStart() && start <= t.getEnd() ) || (end >= t.getStart() && end <= t.getEnd() ))
		{
			return true;
		}
		if( extended && ( ( estart >= t.getStart() && estart <= t.getEnd() ) || (eend >= t.getStart() && eend <= t.getEnd() )))
		{
			return true;
		}
		if(t.isExtended())
		{
			if( ( start >= t.getEstart() && start <= t.getEend() ) || (end >= t.getEstart() && end <= t.getEend() ))
			{
				return true;
			}
			if( extended && ( ( estart >= t.getEstart() && estart <= t.getEend() ) || (eend >= t.getEstart() && eend <= t.getEend() )))
			{
				return true;
			}
		}
		return false; 
	}
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
}

package edu.amrita.timetable;

public class WeekDay 
{
	private int ID;
	private String description;
	public String toString()
	{
		return ID+"-"+description+"\n";
	}
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	
}

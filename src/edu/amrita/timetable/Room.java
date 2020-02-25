package edu.amrita.timetable;

public class Room {
	private int ID;
	private int Region;
	private int Floor,RoomNo;
	private String Wing,Name;
	
	public int getID() {
		return ID;
	}
	public void setID(int iD) {
		ID = iD;
	}
	public int getRegion() {
		return Region;
	}
	public void setRegion(int region) {
		Region = region;
	}
	public int getRoomNo() {
		return RoomNo;
	}
	public void setRoomNo(int roomNo) {
		RoomNo = roomNo;
	}
	public int getFloor() {
		return Floor;
	}
	public void setFloor(int floor) {
		Floor = floor;
	}
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public String getWing() {
		return Wing;
	}
	public void setWing(String wing) {
		Wing = wing;
	}
	public String toString()
	{
		return "("+ID+")"+Region+"-"+Wing+"-"+Floor+"-"+RoomNo+"\n";
	}
}

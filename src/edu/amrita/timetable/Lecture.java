package edu.amrita.timetable;
import java.util.List;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Map;
import java.util.TreeMap;
import org.optaplanner.core.api.domain.entity.PlanningEntity;
import org.optaplanner.core.api.domain.variable.PlanningVariable;
import org.optaplanner.core.api.domain.valuerange.ValueRangeProvider;
@SuppressWarnings("unused")
@PlanningEntity
public class Lecture 
{
	public String toString() 
	{
		return "{"+ID+"~"+Registration+"."+RoomSrc+"-"+TimeSlotSrc+"-"+WeekDaySrc+"}\n";
	}
	private int ID,Registration,LectureNo,RoomSrc,TimeSlotSrc,WeekDaySrc,Parent;
	@PlanningVariable(valueRangeProviderRefs = {"RoomRange"})
	private Room room;
	@PlanningVariable(valueRangeProviderRefs = {"TimeRange"})
	private TimeSlot timeslot;
	@PlanningVariable(valueRangeProviderRefs = {"DayRange"})
	private WeekDay weekday;
	@ValueRangeProvider(id = "RoomRange")
	private List<Room> LstRoom;
	@ValueRangeProvider(id = "TimeRange")
	private List<TimeSlot> LstTime;
	@ValueRangeProvider(id = "DayRange")
	private List<WeekDay> LstDay;
	public List<Room> getLstRoom() {
		return LstRoom;
	}
	public void setLstRoom(List<Room> lstRoom) {
		LstRoom = lstRoom;
	}
	public List<TimeSlot> getLstTime() {
		return LstTime;
	}
	public void setLstTime(List<TimeSlot> lstTime) {
		LstTime = lstTime;
	}
	public List<WeekDay> getLstDay() {
		return LstDay;
	}
	public void setLstDay(List<WeekDay> lstDay) {
		LstDay = lstDay;
	}
	public int getRegistration() {
		return Registration;
	}

	public void setRegistration(int registration) {
		Registration = registration;
	}

	public int getWeekDaySrc() {
		return WeekDaySrc;
	}

	public void setWeekDaySrc(int weekDaySrc) {
		WeekDaySrc = weekDaySrc;
		this.LstDay=new ArrayList<WeekDay>(MapClass.WeekDayGroup.get(new Integer(this.getWeekDaySrc())));
		Collections.shuffle(LstDay);
	}

	public int getLectureNo() {
		return LectureNo;
	}

	public void setLectureNo(int lectureNo) {
		LectureNo = lectureNo;
	}

	public int getTimeSlotSrc() {
		return TimeSlotSrc;
	}

	public void setTimeSlotSrc(int timeSlotSrc) {
		TimeSlotSrc = timeSlotSrc;
		this.LstTime=new ArrayList<TimeSlot>(MapClass.TimeSlotGroup.get(new Integer(this.getTimeSlotSrc())));
		Collections.shuffle(LstTime);
	}

	public int getID() {
		return ID;
	}

	public void setID(int iD) {
		ID = iD;
	}

	public int getRoomSrc() {
		return RoomSrc;
	}

	public void setRoomSrc(int roomSrc) {
		RoomSrc = roomSrc;
		this.LstRoom=new ArrayList<Room>(MapClass.RoomGroup.get(new Integer(this.getRoomSrc())));
	    Collections.shuffle(LstRoom);
	}

	public int getParent() {
		return Parent;
	}

	public void setParent(int parent) {
		Parent = parent;
	}

	public Room getRoom() {
		return room;
	}

	public void setRoom(Room room) {
		this.room = room;
		//if(room!=null)System.out.println("1");
	}

	public TimeSlot getTimeslot() {
		return timeslot;
	}

	public void setTimeslot(TimeSlot timeslot) {
		this.timeslot = timeslot;
		//if(timeslot!=null)System.out.println("2");
	}

	public WeekDay getWeekday() {
		return weekday;
	}

	public void setWeekday(WeekDay weekday) {
		this.weekday = weekday;
		//if(weekday!=null)System.out.println("3");
	}
	
	
	
	
}

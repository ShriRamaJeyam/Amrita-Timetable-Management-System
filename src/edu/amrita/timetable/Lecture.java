package edu.amrita.timetable;
import java.util.List;
import java.util.ArrayList;
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
	private Room room=null;
	@PlanningVariable(valueRangeProviderRefs = {"TimeRange"})
	private TimeSlot timeslot=null;
	@PlanningVariable(valueRangeProviderRefs = {"DayRange"})
	private WeekDay weekday=null;
	@ValueRangeProvider(id = "RoomRange")
	public List<Room> GetRoomList()
	{
		return MapClass.RoomGroup.get(new Integer(this.getRoomSrc()));
	}
	
	@ValueRangeProvider(id = "TimeRange")
	public List<TimeSlot> GetTimeSlotList()
	{
		return MapClass.TimeSlotGroup.get(new Integer(this.getTimeSlotSrc()));
	}
	@ValueRangeProvider(id = "DayRange")
	public List<WeekDay> GetWeekDayList()
	{
		return MapClass.WeekDayGroup.get(new Integer(this.getWeekDaySrc()));
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
	}

	public TimeSlot getTimeslot() {
		return timeslot;
	}

	public void setTimeslot(TimeSlot timeslot) {
		this.timeslot = timeslot;
	}

	public WeekDay getWeekday() {
		return weekday;
	}

	public void setWeekday(WeekDay weekday) {
		this.weekday = weekday;
	}
	
	
	
	
}

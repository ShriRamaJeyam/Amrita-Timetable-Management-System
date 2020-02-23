package edu.amrita.timetable;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

public class MapClass 
{
	public static List<TimeSlot> TimeSlotList=new ArrayList<TimeSlot>();
	public static Map<Integer,List<TimeSlot> > TimeSlotGroup = new TreeMap<Integer,List<TimeSlot> >();
	public static List<WeekDay> WeekDayList=new ArrayList<WeekDay>();
	public static Map<Integer,List<WeekDay> > WeekDayGroup = new TreeMap<Integer,List<WeekDay> >();
	public static List<Faculty> FacultyList=new ArrayList<Faculty>();
	public static Map<Integer,List<Faculty> > FacultyGroup = new TreeMap<Integer,List<Faculty> >();
	public static List<Curriculum> CurriculumList=new ArrayList<Curriculum>();
	public static Map<Integer,List<Curriculum> > CurriculumGroup = new TreeMap<Integer,List<Curriculum> >();
	public static List<Room> RoomList=new ArrayList<Room>();
	public static Map<Integer,List<Room> > RoomGroup = new TreeMap<Integer,List<Room> >();
	
		
}

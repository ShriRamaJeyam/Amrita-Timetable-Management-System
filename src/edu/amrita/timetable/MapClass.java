package edu.amrita.timetable;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;

public class MapClass 
{
	public static List<TimeSlot> TimeSlotList=new ArrayList<TimeSlot>();
	public static Map<Integer,List<TimeSlot> > TimeSlotGroup = new TreeMap<Integer,List<TimeSlot> >();
	
}

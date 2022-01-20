package edu.amrita.timetable;

import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.TreeMap;
import java.util.Set;
import  java.util.TreeSet;
public class MapClass 
{

	public static List<Integer> TeacherList=new ArrayList<Integer>();
	public static Map<Integer,List<Integer> > TeacherMap = new TreeMap<Integer,List<Integer> >();

	public static List<Integer> RoomList=new ArrayList<Integer>();
	public static Map<Integer,List<Integer> > RoomMap = new TreeMap<Integer,List<Integer> >();
	public static Map<Integer,Integer> RoomRegionMap = new TreeMap<Integer,Integer>();

	public static List<TimeSlot> TimeSlotList=new ArrayList<TimeSlot>();
	public static Map<Integer,List<Integer> > TimeSlotMap = new TreeMap<Integer,List<Integer> >();
	public static Map<Integer,Set<Integer> > TimeSlotConflict = new TreeMap<Integer, Set<Integer>>();


	public static List<Integer> SectionList=new ArrayList<Integer>();
	public static Map<Integer,List<Integer> > SectionMap = new TreeMap<Integer,List<Integer> >();


	public static Map<Integer,List<Lecture > > SolutionLectureMap = new TreeMap<Integer,List<Lecture> > ();

	public static TimeSlot food = new TimeSlot(260,320);
	public static TimeSlot foodComp = new TimeSlot(320,370);
	public static Set<Integer> foodConflict = new TreeSet<Integer>();
	public static Set<Integer> foodCompConflict = new TreeSet<Integer>();

	public static int bfr=5000;
	public static int hard=0,soft=0;
	public static int Maxhard=-100000000,Maxsoft=-100000000;

}

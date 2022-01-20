package edu.amrita.timetable;
import java.util.*;

import org.optaplanner.core.api.score.buildin.hardsoft.HardSoftScore;
import org.optaplanner.core.impl.score.director.easy.EasyScoreCalculator;
public class ScoreCalculator implements EasyScoreCalculator<Solver> 
{
	 private static Map<Integer,Lecture> LectureMap;
	 private Integer GetSlot(Lecture l)
	 {
	 	if(l.Parent ==  null)
		{
			return l.TimeSlot;
		}
	 	else
		{
			return LectureMap.get(l.Parent).TimeSlot;
		}
	 }
	private Integer GetDay(Lecture lec)
	{
		if(lec.Parent ==  null)
		{
			return lec.Day;
		}
		else
		{
			return LectureMap.get(lec.Parent).Day;
		}
	}
	@Override
	 public HardSoftScore calculateScore(Solver TimeTable) 
	 {
		 MapClass.hard = 0;
		 MapClass.soft = 0;
		 Integer hard=0,soft=0;
		 List<Lecture> lst = TimeTable.leclst;
		 LectureMap = new TreeMap<Integer, Lecture>();
		 Map<Integer,Map<Integer,List<Lecture> > > SectionLectures = new TreeMap<Integer,Map<Integer,List<Lecture> > >();
		 Map<Integer,Map<Integer,List<Lecture> > > TeacherLectures = new TreeMap<Integer,Map<Integer,List<Lecture> > >();
		 Map<Integer,Map<Integer,List<Lecture> > > RoomLectures = new TreeMap<Integer,Map<Integer,List<Lecture> > >();

		 //Preprocessing
		 {
		 	for(Lecture l: lst)
			{
				LectureMap.put(l.id,l);
			}
			for(Lecture l: lst)
			{
				// Section
				if( l.Parent == null )
				for(Integer i:l.Section)
				{
					if(!SectionLectures.containsKey(i))
					{
						SectionLectures.put(i,new TreeMap<Integer,List<Lecture>>());
					}

					Map<Integer, List<Lecture> > section = SectionLectures.get(i);

					if(!section.containsKey(GetDay(l)))
					{
						section.put(GetDay(l),new ArrayList<Lecture>());
					}

					section.get(GetDay(l)).add(l);
				}

				//Teachers
				if( l.Teacher.get(0) != 0 || l.Teacher.size() != 1 )
				for(Integer i:l.Teacher)
				{
					if(i != 0)
					{
						if(!TeacherLectures.containsKey(i))
						{
							TeacherLectures.put(i,new TreeMap<Integer,List<Lecture>>());
						}

						Map<Integer, List<Lecture> > teacher = TeacherLectures.get(i);

						if(!teacher.containsKey(GetDay(l)))
						{
							teacher.put(GetDay(l),new ArrayList<Lecture>());
						}
						teacher.get(GetDay(l)).add(l);
					}

				}
				if(l.Room != 0)
				{
					if (!RoomLectures.containsKey(l.Room))
					{
						RoomLectures.put(l.Room, new TreeMap<Integer, List<Lecture>>());
					}

					Map<Integer, List<Lecture>> room = RoomLectures.get(l.Room);
					if (!room.containsKey(GetDay(l)))
					{
						room.put(GetDay(l), new ArrayList<Lecture>());
					}

					room.get(GetDay(l)).add(l);
				}

			}
		 }

		 for(Map.Entry<Integer,Map<Integer,List<Lecture> > > section:SectionLectures.entrySet())
		 {
		 	int LateLunchDays = 0;
		 	Set<Integer> numRooms = new TreeSet<Integer>();
			for(Map.Entry<Integer,List<Lecture> > day : section.getValue().entrySet())
			{
				boolean lateLunch = false,lunchComp = true;
				List<Lecture> LecLst = day.getValue();
				for(Lecture first : LecLst)
				{

					numRooms.add(first.Room);
					if(MapClass.foodConflict.contains(GetSlot(first)))
					{
						lateLunch = true;
					}
					if(MapClass.foodCompConflict.contains(GetSlot(first)))
					{
						lunchComp = false;
					}
					for(Lecture second : LecLst)
					{
						if(first != second)
						{
							if(MapClass.TimeSlotConflict.get(GetSlot(first)).contains(GetSlot(second)))
							{
								PenaltyConstants.OVERLAP.SubstractScore(hard,soft);
							}
							if(MapClass.TimeSlotConflict.get(0 - GetSlot(first)).contains(GetSlot(second)))
							{
								if (!MapClass.RoomRegionMap.get(first.Room).equals(MapClass.RoomRegionMap.get(second.Room)))
								PenaltyConstants.REGION_GAP.SubstractScore(hard,soft);
							}
							if(first.Course.equals(second.Course))
							{
								if(first.TimeSlotSrcID == second.TimeSlotSrcID)
								{
									PenaltyConstants.NO_REPEAT_SAME_SLOT.SubstractScore(hard,soft);
								}
								else
								{
									PenaltyConstants.NO_REPEAT_DIFF_SLOT.SubstractScore(hard,soft);
								}
							}
						}
					}
				}
				MapClass.soft -= numRooms.size() * 50;
				if(lateLunch)
				{
					LateLunchDays += 1;
					if(!lunchComp)
					{
						PenaltyConstants.NO_LUNCH_COMP.SubstractScore(hard,soft);
					}
				}

			}
			if(LateLunchDays > 1)
			{
				PenaltyConstants.MANY_DAY_NOLUNCH.SubstractScore(hard,soft);
			}
		 }
		 for(Map.Entry<Integer,Map<Integer,List<Lecture> > > teacher:TeacherLectures.entrySet())
		 {
			 int LateLunchDays = 0;
			 for(Map.Entry<Integer,List<Lecture> > day : teacher.getValue().entrySet())
			 {
				 boolean lateLunch = false,lunchComp = true;
				 List<Lecture> LecLst = day.getValue();
				 for(Lecture first : LecLst)
				 {
					 for(Lecture second : LecLst)
					 {
						 if(MapClass.foodConflict.contains(GetSlot(first)))
						 {
							 lateLunch = true;
						 }
						 if(MapClass.foodCompConflict.contains(GetSlot(first)))
						 {
							 lunchComp = false;
						 }
						 if(first != second)
						 {
							 if(MapClass.TimeSlotConflict.get(GetSlot(first)).contains(GetSlot(second)))
							 {
								 PenaltyConstants.OVERLAP.SubstractScore(hard,soft);
							 }
							 if(MapClass.TimeSlotConflict.get((-1) - GetSlot(first)).contains(GetSlot(second)))
							 {
								 PenaltyConstants.REGION_GAP.SubstractScore(hard,soft);
							 }
						 }
					 }
				 }
				 if(lateLunch)
				 {
					 LateLunchDays += 1;
					 if(!lunchComp)
					 {
						 PenaltyConstants.NO_LUNCH_COMP.SubstractScore(hard,soft);
					 }
				 }
			 }
			 if(LateLunchDays > 1)
			 {
				 PenaltyConstants.MANY_DAY_NOLUNCH.SubstractScore(hard,soft);

			 }
		 }
		 for(Map.Entry<Integer,Map<Integer,List<Lecture> > > room:RoomLectures.entrySet())
		 {
			 for(Map.Entry<Integer,List<Lecture> > day : room.getValue().entrySet())
			 {
				 List<Lecture> LecLst = day.getValue();
				 for(Lecture first : LecLst)
				 {
					 for(Lecture second : LecLst)
					 {
						 if(first != second)
						 {
							 if(MapClass.TimeSlotConflict.get(GetSlot(first)).contains(GetSlot(second)))
							 {
								 PenaltyConstants.OVERLAP.SubstractScore(hard,soft);
							 }
						 }
					 }
				 }
			 }
		 }
		 MapClass.soft -= 50 * RoomLectures.size();
		 MapClass.bfr--;
		 if(MapClass.Maxhard <= MapClass.hard)
		 {
			 MapClass.Maxhard = MapClass.hard;
			 if(MapClass.Maxsoft<= MapClass.soft)
			 {
				 MapClass.Maxsoft = MapClass.soft;
			 }
		 }
		 if(MapClass.bfr==0)
		 {
			 MapClass.bfr=5000;
			 System.out.println("{"+MapClass.hard+","+MapClass.soft+"} ->"+"{"+MapClass.Maxhard+","+MapClass.Maxsoft+"}");
		 }

		 return HardSoftScore.of(MapClass.hard, MapClass.soft);

	 }
}
